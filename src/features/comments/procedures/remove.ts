import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { comments } from '@/db/schema/comments';
import { tasks } from '@/db/schema/tasks';
import { getProjectAccess } from '@/features/projects/utils/get-project-access';
import { protectedProcedure } from '@/trpc/init';

export const remove = protectedProcedure
	.input(z.object({ commentId: z.string() }))
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [existingComment] = await db
			.select({
				comment: comments,
				projectId: tasks.projectId,
			})
			.from(comments)
			.innerJoin(tasks, eq(tasks.id, comments.taskId))
			.where(eq(comments.id, input.commentId))
			.limit(1);

		if (!existingComment) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'tasks.comment_not_found',
			});
		}

		const { isProjectAdmin, isOrgAdmin } = await getProjectAccess({
			projectId: existingComment.projectId,
			userId,
		});

		const canDelete =
			existingComment.comment.userId === userId || isProjectAdmin || isOrgAdmin;

		if (!canDelete) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'common.access_denied',
			});
		}

		const [deletedComment] = await db
			.delete(comments)
			.where(eq(comments.id, input.commentId))
			.returning();

		return { ...deletedComment, projectId: existingComment.projectId };
	});
