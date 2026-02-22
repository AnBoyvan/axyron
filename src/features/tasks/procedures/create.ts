import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { activities } from '@/db/schema/activities';
import { assignees } from '@/db/schema/assignees';
import { projectMembers } from '@/db/schema/project-members';
import { tasks } from '@/db/schema/tasks';
import { getProjectAccess } from '@/features/projects/utils/get-project-access';
import { protectedProcedure } from '@/trpc/init';

import { createTaskSchema } from '../schemas/create-task-schema';

export const create = protectedProcedure
	.input(
		z.object({
			projectId: z.string(),
			data: createTaskSchema,
		}),
	)
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;
		const { projectId, data } = input;

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

		const [createdTask] = await db
			.insert(tasks)
			.values({
				title: data.title,
				description: data.description,
				projectId: projectId,
				organizationId: project.organizationId,
				createdBy: userId,
				priority: data.priority,
				status: 'pending',
				startDate: data.startDate ? new Date(data.startDate) : null,
				dueDate: data.dueDate ? new Date(data.dueDate) : null,
				needReview: data.needReview,
			})
			.returning();

		if (data.assigneeIds && data.assigneeIds.length > 0) {
			const projectMemberIds = await db
				.select({ userId: projectMembers.userId })
				.from(projectMembers)
				.where(eq(projectMembers.projectId, projectId));

			const userIds = projectMemberIds.map(m => m.userId);
			const validIds = data.assigneeIds.filter(id => userIds.includes(id));

			await db.insert(assignees).values(
				validIds.map(assigneeId => ({
					userId: assigneeId,
					taskId: createdTask.id,
				})),
			);

			await db.insert(activities).values(
				validIds.map(assigneeId => ({
					projectId: projectId,
					taskId: createdTask.id,
					authorId: userId,
					entityId: assigneeId,
					entityType: 'user' as const,
					action: 'assigned' as const,
				})),
			);
		}

		await db.insert(activities).values({
			projectId: projectId,
			taskId: createdTask.id,
			authorId: userId,
			entityId: createdTask.id,
			entityType: 'task',
			action: 'created',
		});

		return createdTask;
	});
