import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { comments } from '@/db/schema/comments';
import { tasks } from '@/db/schema/tasks';
import { getProjectAccess } from '@/features/projects/utils/get-project-access';
import { protectedProcedure } from '@/trpc/init';

import { MAX_COMMENT_SIZE } from '../constants';

export const create = protectedProcedure
	.input(
		z.object({
			taskId: z.string(),
			content: z.string().min(1).max(MAX_COMMENT_SIZE),
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

		const [createdComment] = await db
			.insert(comments)
			.values({
				taskId: input.taskId,
				userId,
				content: input.content,
			})
			.returning();

		return createdComment;
	});
