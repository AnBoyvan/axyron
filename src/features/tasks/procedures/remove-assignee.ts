import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { activities } from '@/db/schema/activities';
import { assignees } from '@/db/schema/assignees';
import { tasks } from '@/db/schema/tasks';
import { user } from '@/db/schema/user';
import { getProjectAccess } from '@/features/projects/utils/get-project-access';
import { protectedProcedure } from '@/trpc/init';

export const removeAssignee = protectedProcedure
	.input(z.object({ taskId: z.string(), userId: z.string() }))
	.mutation(async ({ ctx, input }) => {
		const currentUserId = ctx.auth.user.id;

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
			userId: currentUserId,
		});

		if (!canCreateTask) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'common.access_denied',
			});
		}

		const [userData] = await db
			.select({
				name: user.name,
				email: user.email,
			})
			.from(user)
			.where(eq(user.id, input.userId))
			.limit(1);

		const [removedAssignee] = await db
			.delete(assignees)
			.where(
				and(
					eq(assignees.userId, input.userId),
					eq(assignees.taskId, input.taskId),
				),
			)
			.returning({ userId: assignees.userId });

		if (!removedAssignee) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'assignees.not_found',
			});
		}

		await db.insert(activities).values({
			projectId: existingTask.projectId,
			taskId: existingTask.id,
			authorId: currentUserId,
			entityId: removedAssignee.userId,
			entityType: 'user',
			action: 'unassigned',
		});

		return {
			userId: removedAssignee.userId,
			name: userData?.name,
			email: userData?.email,
			projectId: existingTask.projectId,
			taskId: existingTask.id,
		};
	});
