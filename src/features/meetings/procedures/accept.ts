import { TRPCError } from '@trpc/server';
import { and, eq, sql } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { meetingMembers } from '@/db/schema/meeting-members';
import { protectedProcedure } from '@/trpc/init';

export const accept = protectedProcedure
	.input(z.object({ meetingId: z.string() }))
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [existingInvite] = await db
			.select()
			.from(meetingMembers)
			.where(
				and(
					eq(meetingMembers.userId, userId),
					eq(meetingMembers.meetingId, input.meetingId),
				),
			)
			.limit(1);

		if (!existingInvite) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'meetings.invite_not_found',
			});
		}

		if (existingInvite.status === 'accepted') {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'meetings.already_accepted',
			});
		}

		const [accepted] = await db
			.update(meetingMembers)
			.set({
				status: 'accepted',
				updatedAt: sql`now()`,
			})
			.where(
				and(
					eq(meetingMembers.userId, userId),
					eq(meetingMembers.meetingId, input.meetingId),
				),
			)
			.returning();

		return accepted;
	});
