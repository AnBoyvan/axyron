import { TRPCError } from '@trpc/server';
import { eq, inArray } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { comments } from '@/db/schema/comments';
import { tasks } from '@/db/schema/tasks';
import { getProjectAccess } from '@/features/projects/utils/get-project-access';
import { protectedProcedure } from '@/trpc/init';

import { MAX_TASK_COMMENT_SIZE } from '../constants';

export const create = protectedProcedure
	.input(
		z.object({
			taskId: z.string(),
			content: z.string().min(1).max(MAX_TASK_COMMENT_SIZE),
			parentId: z.string().nullish(),
		}),
	)
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [existingTask] = await db
			.select({ projectId: tasks.projectId })
			.from(tasks)
			.where(eq(tasks.id, input.taskId))
			.limit(1);

		if (!existingTask) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'tasks.not_found',
			});
		}

		const [existingComment] = await db
			.select()
			.from(comments)
			.where(inArray(comments.id, input.parentId ? [input.parentId] : []));

		const { isMember, isOrgAdmin } = await getProjectAccess({
			projectId: existingTask.projectId,
			userId,
		});

		if (!isMember && !isOrgAdmin) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'common.access_denied',
			});
		}

		if (!existingComment && input.parentId) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'tasks.comment_not_found',
			});
		}

		if (existingComment?.parentId && input.parentId) {
			throw new TRPCError({ code: 'BAD_REQUEST' });
		}

		const [createdComment] = await db
			.insert(comments)
			.values({
				taskId: input.taskId,
				userId,
				content: input.content,
				parentId: input.parentId,
			})
			.returning();

		return createdComment;
	});
