import { TRPCError } from '@trpc/server';
import { eq, sql } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { activities } from '@/db/schema/activities';
import { subtasks } from '@/db/schema/subtasks';
import { tasks } from '@/db/schema/tasks';
import { getProjectAccess } from '@/features/projects/utils/get-project-access';
import { protectedProcedure } from '@/trpc/init';

export const updateSubtask = protectedProcedure
	.input(
		z.object({
			subtaskId: z.string(),
			title: z.string().min(1).max(255),
		}),
	)
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [existingSubtask] = await db
			.select()
			.from(subtasks)
			.where(eq(subtasks.id, input.subtaskId))
			.limit(1);

		if (!existingSubtask) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'tasks.subtask_not_found',
			});
		}

		const [existingTask] = await db
			.select()
			.from(tasks)
			.where(eq(tasks.id, existingSubtask.taskId))
			.limit(1);

		if (!existingTask) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'tasks.not_found',
			});
		}

		const { canCreateTask } = await getProjectAccess({
			projectId: existingTask.projectId,
			userId,
		});

		if (!canCreateTask) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'common.access_denied',
			});
		}

		const [updatedSubtask] = await db
			.update(subtasks)
			.set({
				title: input.title,
				updatedAt: sql`now()`,
			})
			.where(eq(subtasks.id, input.subtaskId))
			.returning();

		if (existingSubtask.title !== input.title) {
			await db.insert(activities).values({
				projectId: existingTask.projectId,
				taskId: existingTask.id,
				authorId: userId,
				entityId: existingSubtask.id,
				entityType: 'subtask',
				action: 'renamed',
				meta: {
					from: existingSubtask.title,
					to: updatedSubtask.title,
					title: updatedSubtask.title,
				},
			});
		}
		return { ...updatedSubtask, projectId: existingTask.projectId };
	});
