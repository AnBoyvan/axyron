import { TRPCError } from '@trpc/server';
import { and, eq, getTableColumns } from 'drizzle-orm';

import { db } from '@/db';
import { meetingMembers } from '@/db/schema/meeting-members';
import { meetings } from '@/db/schema/meetings';
import { organizationMembers } from '@/db/schema/organization-members';
import { organizations } from '@/db/schema/organizations';
import { getOrgPermissions } from '@/features/organizations/utils/get-org-permission';
import { protectedProcedure } from '@/trpc/init';

import { createMeetingSchema } from '../schemas/create-meeting-schema';

export const create = protectedProcedure
	.input(createMeetingSchema)
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

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
			.where(eq(organizations.id, input.organizationId))
			.limit(1);

		if (!data) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'orgs.not_found',
			});
		}

		const permissions = getOrgPermissions({
			org: data.org,
			member: data.member,
		});

		if (!permissions.createMeeting) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'common.access_denied',
			});
		}

		const [createdMeeting] = await db
			.insert(meetings)
			.values({
				title: input.title,
				description: input.description,
				meetingUrl: input.meetingUrl,
				startTime: new Date(input.startTime),
				duration: input.duration,
				organizationId: input.organizationId,
				createdBy: userId,
			})
			.returning();

		await Promise.all(
			input.memberIds.map(async id => {
				await db.insert(meetingMembers).values({
					userId: id,
					meetingId: createdMeeting.id,
					organizationId: data.org.id,
					status: 'pending',
				});
			}),
		);

		return createdMeeting;
	});
