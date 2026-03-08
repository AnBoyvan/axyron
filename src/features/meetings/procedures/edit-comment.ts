import { TRPCError } from '@trpc/server';
import { and, eq, sql } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { meetingComments } from '@/db/schema/meeting-comments';
import { MAX_COMMENT_SIZE } from '@/features/task-comments/constants';
import { protectedProcedure } from '@/trpc/init';

export const editComment = protectedProcedure
	.input(
		z.object({
			commentId: z.string(),
			content: z.string().min(1).max(MAX_COMMENT_SIZE),
		}),
	)
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [updatedComment] = await db
			.update(meetingComments)
			.set({
				content: input.content,
				edited: true,
				updatedAt: sql`now()`,
			})
			.where(
				and(
					eq(meetingComments.id, input.commentId),
					eq(meetingComments.userId, userId),
				),
			)
			.returning();

		if (!updatedComment) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'comments.not_found',
			});
		}

		return updatedComment;
	});
