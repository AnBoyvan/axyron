import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { activities } from '@/db/schema/activities';
import { assignees } from '@/db/schema/assignees';
import { projectMembers } from '@/db/schema/project-members';
import { tasks } from '@/db/schema/tasks';
import { getProjectAccess } from '@/features/projects/utils/get-project-access';
import { protectedProcedure } from '@/trpc/init';

import { createTaskSchema } from '../schemas/create-task-schema';

export const create = protectedProcedure
	.input(createTaskSchema)
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const { project, canCreateTask } = await getProjectAccess({
			projectId: input.projectId,
			userId,
		});

		if (!canCreateTask) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'common.access_denied',
			});
		}

		// Створюємо задачу
		const [createdTask] = await db
			.insert(tasks)
			.values({
				title: input.title,
				description: input.description,
				projectId: input.projectId,
				organizationId: project.organizationId,
				createdBy: userId,
				priority: input.priority,
				status: input.status,
				startDate: input.startDate ? new Date(input.startDate) : null,
				dueDate: input.dueDate ? new Date(input.dueDate) : null,
				needReview: input.needReview,
			})
			.returning();

		if (input.assigneeIds && input.assigneeIds.length > 0) {
			const projectMemberIds = await db
				.select({ userId: projectMembers.userId })
				.from(projectMembers)
				.where(eq(projectMembers.projectId, input.projectId));

			const userIds = projectMemberIds.map(m => m.userId);
			const validIds = input.assigneeIds.filter(id => userIds.includes(id));

			await db.insert(assignees).values(
				validIds.map(assigneeId => ({
					userId: assigneeId,
					taskId: createdTask.id,
				})),
			);

			await db.insert(activities).values(
				validIds.map(assigneeId => ({
					projectId: input.projectId,
					taskId: createdTask.id,
					authorId: userId,
					entityId: assigneeId,
					entityType: 'user' as const,
					action: 'assigned' as const,
				})),
			);
		}

		await db.insert(activities).values({
			projectId: input.projectId,
			taskId: createdTask.id,
			authorId: userId,
			entityId: createdTask.id,
			entityType: 'task',
			action: 'created',
		});

		return createdTask;
	});
