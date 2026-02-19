import { and, eq } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { commentReactions } from '@/db/schema/comment-reactions';
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
			.from(commentReactions)

			.where(
				and(
					eq(commentReactions.commentId, input.commentId),
					eq(commentReactions.userId, userId),
					eq(commentReactions.emoji, input.emoji),
				),
			)
			.limit(1);

		if (existingReaction) {
			const [deletedReaction] = await db
				.delete(commentReactions)
				.where(
					and(
						eq(commentReactions.commentId, input.commentId),
						eq(commentReactions.userId, userId),
					),
				)
				.returning();

			return deletedReaction;
		}

		const [createdReaction] = await db
			.insert(commentReactions)
			.values({
				commentId: input.commentId,
				userId,
				emoji: input.emoji,
			})
			.onConflictDoUpdate({
				target: [commentReactions.userId, commentReactions.commentId],
				set: {
					emoji: input.emoji,
				},
			})
			.returning();

		return createdReaction;
	});
