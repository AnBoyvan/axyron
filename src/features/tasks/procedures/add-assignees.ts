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

export const addAssignees = protectedProcedure
	.input(z.object({ taskId: z.string(), userIds: z.array(z.string()) }))
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

		const projectMemberIds = await db
			.select({ userId: projectMembers.userId })
			.from(projectMembers)
			.where(eq(projectMembers.projectId, existingTask.projectId));

		const userIds = projectMemberIds.map(m => m.userId);
		const validIds = input.userIds.filter(id => userIds.includes(id));

		await db.insert(assignees).values(
			validIds.map(assigneeId => ({
				userId: assigneeId,
				taskId: existingTask.id,
			})),
		);

		const newAssignees = await db
			.insert(assignees)
			.values(
				input.userIds.map(assigneeId => ({
					userId: assigneeId,
					taskId: input.taskId,
				})),
			)
			.onConflictDoNothing()
			.returning({ userId: assignees.userId });

		if (newAssignees.length > 0) {
			await db.insert(activities).values(
				newAssignees.map(assignee => ({
					projectId: existingTask.projectId,
					taskId: existingTask.id,
					authorId: userId,
					entityId: assignee.userId,
					entityType: 'user' as const,
					action: 'assigned' as const,
				})),
			);
		}

		return {
			added: newAssignees.length,
			taskId: existingTask.id,
			projectId: existingTask.projectId,
		};
	});
