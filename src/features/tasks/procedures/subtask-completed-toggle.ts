import { TRPCError } from '@trpc/server';
import { eq, sql } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { subtasks } from '@/db/schema/subtasks';
import { tasks } from '@/db/schema/tasks';
import { getProjectAccess } from '@/features/projects/utils/get-project-access';
import { protectedProcedure } from '@/trpc/init';

export const subtaskCompletedToggle = protectedProcedure
	.input(z.object({ subtaskId: z.string() }))
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
				completed: !existingSubtask.completed,
				updatedAt: sql`now()`,
			})
			.where(eq(subtasks.id, input.subtaskId))
			.returning();

		return { ...updatedSubtask, projectId: existingTask.projectId };
	});
