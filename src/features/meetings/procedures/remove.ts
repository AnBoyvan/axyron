import { TRPCError } from '@trpc/server';
import { and, eq, getTableColumns } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { meetings } from '@/db/schema/meetings';
import { organizationMembers } from '@/db/schema/organization-members';
import { organizations } from '@/db/schema/organizations';
import { protectedProcedure } from '@/trpc/init';

import { getOrgPermissions } from '../../organizations/utils/get-org-permission';

export const remove = protectedProcedure
	.input(z.object({ meetingId: z.string() }))
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

		const [data] = await db
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

		if (!data) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'common.access_denied',
			});
		}

		const permissions = getOrgPermissions({
			org: data.org,
			member: data.member,
		});

		const canDelete =
			existingMeeting.createdBy === userId || permissions.isAdmin;

		if (!canDelete) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'common.access_denied',
			});
		}

		const [deletedMeeting] = await db
			.delete(meetings)
			.where(eq(meetings.id, input.meetingId))
			.returning();

		return deletedMeeting;
	});
