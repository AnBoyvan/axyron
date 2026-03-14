import { TRPCError } from '@trpc/server';
import { and, eq, sql } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { meetingMembers } from '@/db/schema/meeting-members';
import { protectedProcedure } from '@/trpc/init';

export const changeStatus = protectedProcedure
	.input(
		z.object({
			meetingId: z.string(),
			status: z.enum(['pending', 'accepted', 'rejected']),
		}),
	)
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [updated] = await db
			.update(meetingMembers)
			.set({
				status: input.status,
				updatedAt: sql`now()`,
			})
			.where(
				and(
					eq(meetingMembers.userId, userId),
					eq(meetingMembers.meetingId, input.meetingId),
				),
			)
			.returning();

		if (!updated) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'meetings.not_found',
			});
		}

		return updated;
	});
