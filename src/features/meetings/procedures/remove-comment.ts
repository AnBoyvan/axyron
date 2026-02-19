import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { meetingComments } from '@/db/schema/meeting-comments';
import { meetings } from '@/db/schema/meetings';
import { protectedProcedure } from '@/trpc/init';

export const removeComment = protectedProcedure
	.input(z.object({ commentId: z.string() }))
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [existingComment] = await db
			.select({
				comment: meetingComments,
				organizationId: meetings.organizationId,
				createdBy: meetings.createdBy,
			})
			.from(meetingComments)
			.innerJoin(meetings, eq(meetings.id, meetingComments.meetingId))
			.where(eq(meetingComments.id, input.commentId))
			.limit(1);

		if (!existingComment) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'comments.not_found',
			});
		}

		if (
			existingComment.comment.userId !== userId &&
			existingComment.createdBy !== userId
		) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'common.access_denied',
			});
		}

		const [deletedComment] = await db
			.delete(meetingComments)
			.where(eq(meetingComments.id, input.commentId))
			.returning();

		return deletedComment;
	});
