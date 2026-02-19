import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { activities } from '@/db/schema/activities';
import { subtasks } from '@/db/schema/subtasks';
import { tasks } from '@/db/schema/tasks';
import { getProjectAccess } from '@/features/projects/utils/get-project-access';
import { protectedProcedure } from '@/trpc/init';

export const addSubtask = protectedProcedure
	.input(
		z.object({
			taskId: z.string(),
			title: z.string().min(1).max(255),
		}),
	)
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [existingTask] = await db
			.select()
			.from(tasks)
			.where(eq(tasks.id, input.taskId))
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

		const existingSubtasks = await db
			.select({ position: subtasks.position })
			.from(subtasks)
			.where(eq(subtasks.taskId, input.taskId))
			.orderBy(subtasks.position);

		const lastPosition =
			existingSubtasks.length > 0
				? Math.max(...existingSubtasks.map(s => s.position))
				: -1;

		const [createdSubtask] = await db
			.insert(subtasks)
			.values({
				taskId: input.taskId,
				title: input.title,
				position: lastPosition + 1,
			})
			.returning();

		await db.insert(activities).values({
			projectId: existingTask.projectId,
			taskId: existingTask.id,
			authorId: userId,
			entityId: createdSubtask.id,
			entityType: 'subtask',
			action: 'created',
		});

		return createdSubtask;
	});
