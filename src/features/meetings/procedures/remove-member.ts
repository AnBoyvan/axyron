import { TRPCError } from '@trpc/server';
import { and, eq, getTableColumns } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { meetingMembers } from '@/db/schema/meeting-members';
import { meetings } from '@/db/schema/meetings';
import { organizationMembers } from '@/db/schema/organization-members';
import { protectedProcedure } from '@/trpc/init';

export const removeMember = protectedProcedure
	.input(z.object({ meetingId: z.string(), userId: z.string() }))
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [existingMeeting] = await db
			.select({
				...getTableColumns(meetings),
				member: organizationMembers,
			})
			.from(meetings)
			.innerJoin(
				organizationMembers,
				and(
					eq(organizationMembers.userId, userId),
					eq(organizationMembers.organizationId, meetings.organizationId),
				),
			)
			.where(eq(meetings.id, input.meetingId))
			.limit(1);

		if (!existingMeeting) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'meetings.not_found',
			});
		}

		const canRemove =
			existingMeeting.createdBy === userId ||
			existingMeeting.member.role === 'admin';

		if (!canRemove) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'common.access_denied',
			});
		}

		const [deletedMember] = await db
			.delete(meetingMembers)
			.where(
				and(
					eq(meetingMembers.meetingId, input.meetingId),
					eq(meetingMembers.userId, input.userId),
				),
			)
			.returning();

		return deletedMember;
	});
