import { TRPCError } from '@trpc/server';
import { and, eq, gte, lte, sql } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { subtasks } from '@/db/schema/subtasks';
import { tasks } from '@/db/schema/tasks';
import { getProjectAccess } from '@/features/projects/utils/get-project-access';
import { protectedProcedure } from '@/trpc/init';

export const reorderSubtasks = protectedProcedure
	.input(
		z.object({
			subtaskId: z.string(),
			newPosition: z.number().int().min(0),
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
				message: 'subtasks.not_found',
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

		const oldPosition = existingSubtask.position;
		const newPosition = input.newPosition;

		if (oldPosition === newPosition) {
			return existingTask;
		}

		const allSubtasks = await db
			.select({ id: subtasks.id })
			.from(subtasks)
			.where(eq(subtasks.taskId, existingSubtask.taskId));

		const maxPosition = allSubtasks.length - 1;

		if (newPosition > maxPosition) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'subtasks.invalid_position',
			});
		}

		if (oldPosition < newPosition) {
			await db
				.update(subtasks)
				.set({ position: sql`${subtasks.position} - 1`, updatedAt: sql`now()` })
				.where(
					and(
						eq(subtasks.taskId, existingSubtask.taskId),
						gte(subtasks.position, oldPosition + 1),
						lte(subtasks.position, newPosition),
					),
				);
		} else {
			await db
				.update(subtasks)
				.set({ position: sql`${subtasks.position} + 1`, updatedAt: sql`now()` })
				.where(
					and(
						eq(subtasks.taskId, existingSubtask.taskId),
						gte(subtasks.position, newPosition),
						lte(subtasks.position, oldPosition - 1),
					),
				);
		}

		await db
			.update(subtasks)
			.set({ position: newPosition, updatedAt: sql`now()` })
			.where(eq(subtasks.id, input.subtaskId));

		return existingSubtask;
	});
