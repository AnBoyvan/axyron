import { TRPCError } from '@trpc/server';
import { and, eq, getTableColumns, sql } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { meetings } from '@/db/schema/meetings';
import { organizationMembers } from '@/db/schema/organization-members';
import { organizations } from '@/db/schema/organizations';
import { getOrgPermissions } from '@/features/organizations/utils/get-org-permission';
import { protectedProcedure } from '@/trpc/init';

const updateMeetingSchema = z.object({
	title: z.string().min(1).max(255).optional(),
	description: z.string().optional().nullable(),
	meetingUrl: z.string().url().optional().nullable(),
	startTime: z.string().datetime().optional(),
	duration: z.number().int().min(1).optional(),
});

export const update = protectedProcedure
	.input(z.object({ meetingId: z.string(), data: updateMeetingSchema }))
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [existingMeeting] = await db
			.select()
			.from(meetings)
			.where(eq(meetings.id, input.meetingId))
			.limit(1);

		if (!existingMeeting) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'meetings.not_found',
			});
		}

		const [row] = await db
			.select({
				org: getTableColumns(organizations),
				member: getTableColumns(organizationMembers),
			})
			.from(organizations)
			.innerJoin(
				organizationMembers,
				and(
					eq(organizationMembers.organizationId, organizations.id),
					eq(organizationMembers.userId, userId),
				),
			)
			.where(eq(organizations.id, existingMeeting.organizationId))
			.limit(1);

		if (!row) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'common.access_denied',
			});
		}

		const permissions = getOrgPermissions({
			org: row.org,
			member: row.member,
		});

		const canEdit = existingMeeting.createdBy === userId || permissions.isAdmin;

		if (!canEdit) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'common.access_denied',
			});
		}

		const [updatedMeeting] = await db
			.update(meetings)
			.set({
				...input.data,
				startTime: input.data.startTime
					? new Date(input.data.startTime)
					: undefined,
				updatedAt: sql`now()`,
			})
			.where(eq(meetings.id, input.meetingId))
			.returning();

		return updatedMeeting;
	});
