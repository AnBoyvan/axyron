import { TRPCError } from '@trpc/server';
import { and, eq, sql } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { comments } from '@/db/schema/comments';
import { protectedProcedure } from '@/trpc/init';

import { MAX_COMMENT_SIZE } from '../constants';

export const update = protectedProcedure
	.input(
		z.object({
			commentId: z.string(),
			content: z.string().min(1).max(MAX_COMMENT_SIZE),
		}),
	)
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [updatedComment] = await db
			.update(comments)
			.set({
				content: input.content,
				edited: true,
				updatedAt: sql`now()`,
			})
			.where(and(eq(comments.id, input.commentId), eq(comments.userId, userId)))
			.returning();

		if (!updatedComment) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'tasks.comment_not_found',
			});
		}

		return updatedComment;
	});
