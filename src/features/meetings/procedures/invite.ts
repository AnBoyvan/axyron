import { TRPCError } from '@trpc/server';
import { and, eq, getTableColumns } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { meetingMembers } from '@/db/schema/meeting-members';
import { meetings } from '@/db/schema/meetings';
import { organizationMembers } from '@/db/schema/organization-members';
import { protectedProcedure } from '@/trpc/init';

export const invite = protectedProcedure
	.input(z.object({ meetingId: z.string(), userIds: z.array(z.string()) }))
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

		const canInvite =
			existingMeeting.createdBy === userId ||
			existingMeeting.member.role === 'admin';

		if (!canInvite) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'common.access_denied',
			});
		}

		const orgMembers = await db
			.select({ userId: organizationMembers.userId })
			.from(organizationMembers)
			.where(
				eq(organizationMembers.organizationId, existingMeeting.organizationId),
			);

		const userIds = orgMembers.map(m => m.userId);
		const validIds = input.userIds.filter(id => !userIds.includes(id));

		const newInvites = await db
			.insert(meetingMembers)
			.values(
				validIds.map(id => ({
					userId: id,
					meetingId: input.meetingId,
					organizationId: existingMeeting.organizationId,
					status: 'pending' as const,
				})),
			)
			.onConflictDoNothing()
			.returning({ userId: meetingMembers.userId });

		return { invited: newInvites.length };
	});
