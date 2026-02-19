import { TRPCError } from '@trpc/server';
import { eq, sql } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { activities } from '@/db/schema/activities';
import { tasks } from '@/db/schema/tasks';
import { getProjectAccess } from '@/features/projects/utils/get-project-access';
import { protectedProcedure } from '@/trpc/init';

import { updateTaskSchema } from '../schemas/update-task-schema';

export const update = protectedProcedure
	.input(z.object({ taskId: z.string(), data: updateTaskSchema }))
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

		const { canCreateTask, isProjectAdmin, isOrgAdmin } =
			await getProjectAccess({
				projectId: existingTask.projectId,
				userId,
			});

		if (!canCreateTask) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'common.access_denied',
			});
		}

		if (
			input.data.status !== undefined &&
			(input.data.status === 'completed' ||
				input.data.status === 'cancelled') &&
			input.data.status !== existingTask.status &&
			!isProjectAdmin &&
			!isOrgAdmin
		) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'tasks.only_admin_can_complete_or_cancel',
			});
		}

		const [updatedTask] = await db
			.update(tasks)
			.set({
				...input.data,
				startDate:
					input.data.startDate !== undefined
						? input.data.startDate
							? new Date(input.data.startDate)
							: null
						: undefined,
				dueDate:
					input.data.dueDate !== undefined
						? input.data.dueDate
							? new Date(input.data.dueDate)
							: null
						: undefined,
				updatedAt: sql`now()`,
			})
			.where(eq(tasks.id, input.taskId))
			.returning();

		const activitiesToCreate: (typeof activities.$inferInsert)[] = [];

		if (
			input.data.title !== undefined &&
			existingTask.title !== input.data.title
		) {
			activitiesToCreate.push({
				projectId: existingTask.projectId,
				taskId: existingTask.id,
				authorId: userId,
				entityId: existingTask.id,
				entityType: 'task',
				action: 'renamed',
				meta: {
					from: existingTask.title,
					to: updatedTask.title,
				},
			});
		}

		if (
			input.data.status !== undefined &&
			existingTask.status !== input.data.status
		) {
			activitiesToCreate.push({
				projectId: existingTask.projectId,
				taskId: existingTask.id,
				authorId: userId,
				entityId: existingTask.id,
				entityType: 'task',
				action: 'status',
				meta: {
					from: existingTask.status,
					to: updatedTask.status,
				},
			});
		}

		if (
			input.data.priority !== undefined &&
			existingTask.priority !== input.data.priority
		) {
			activitiesToCreate.push({
				projectId: existingTask.projectId,
				taskId: existingTask.id,
				authorId: userId,
				entityId: existingTask.id,
				entityType: 'task',
				action: 'priority',
				meta: {
					from: existingTask.priority,
					to: updatedTask.priority,
				},
			});
		}

		if (input.data.startDate !== undefined) {
			const oldDate = existingTask.startDate?.toISOString() ?? null;
			const newDate = input.data.startDate;
			if (oldDate !== newDate) {
				activitiesToCreate.push({
					projectId: existingTask.projectId,
					taskId: existingTask.id,
					authorId: userId,
					entityId: existingTask.id,
					entityType: 'task',
					action: 'start_date',
					meta: {
						from: oldDate,
						to: newDate,
					},
				});
			}
		}

		if (input.data.dueDate !== undefined) {
			const oldDate = existingTask.dueDate?.toISOString() ?? null;
			const newDate = input.data.dueDate;
			if (oldDate !== newDate) {
				activitiesToCreate.push({
					projectId: existingTask.projectId,
					taskId: existingTask.id,
					authorId: userId,
					entityId: existingTask.id,
					entityType: 'task',
					action: 'due_date',
					meta: {
						from: oldDate,
						to: newDate,
					},
				});
			}
		}

		if (activitiesToCreate.length > 0) {
			await db.insert(activities).values(activitiesToCreate);
		}

		return updatedTask;
	});
