import { and, eq } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { meetingCommentReactions } from '@/db/schema/meeting-comment-reactions';
import { protectedProcedure } from '@/trpc/init';

export const setReaction = protectedProcedure
	.input(
		z.object({
			commentId: z.string(),
			emoji: z.string(),
		}),
	)
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [existingReaction] = await db
			.select()
			.from(meetingCommentReactions)
			.where(
				and(
					eq(meetingCommentReactions.commentId, input.commentId),
					eq(meetingCommentReactions.userId, userId),
				),
			)
			.limit(1);

		if (existingReaction?.emoji === input.emoji) {
			const [deleted] = await db
				.delete(meetingCommentReactions)
				.where(
					and(
						eq(meetingCommentReactions.commentId, input.commentId),
						eq(meetingCommentReactions.userId, userId),
					),
				)
				.returning();

			return deleted;
		}

		const [upserted] = await db
			.insert(meetingCommentReactions)
			.values({
				commentId: input.commentId,
				userId,
				emoji: input.emoji,
			})
			.onConflictDoUpdate({
				target: [
					meetingCommentReactions.userId,
					meetingCommentReactions.commentId,
				],
				set: { emoji: input.emoji },
			})
			.returning();

		return upserted;
	});
