import { eq, inArray, sql } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { assignees } from '@/db/schema/assignees';
import { tasks } from '@/db/schema/tasks';
import { getProjectAccess } from '@/features/projects/utils/get-project-access';
import { protectedProcedure } from '@/trpc/init';

import { getTasksQuery } from '../utils/get-tasks-by-query';
import { mapTask } from '../utils/map-tasks';

export const getByUser = protectedProcedure
	.input(
		z.object({
			userId: z.string().optional(),
			organizationId: z.string().optional(),
			limit: z.number().optional(),
		}),
	)
	.query(async ({ ctx, input }) => {
		const targetUserId = input.userId ?? ctx.auth.user.id;
		const currentUserId = ctx.auth.user.id;

		const userAssignments = await db
			.select({ taskId: assignees.taskId })
			.from(assignees)
			.where(eq(assignees.userId, targetUserId));

		const taskIds = userAssignments.map(a => a.taskId);

		const assignedConditions = taskIds.length
			? [inArray(tasks.id, taskIds)]
			: [sql`false`];
		const createdConditions = [eq(tasks.createdBy, targetUserId)];

		if (input.organizationId) {
			assignedConditions.push(eq(tasks.organizationId, input.organizationId));
			createdConditions.push(eq(tasks.organizationId, input.organizationId));
		}

		const [assignedTasks, createdTasks] = await Promise.all([
			getTasksQuery({ conditions: assignedConditions, limit: input.limit }),
			getTasksQuery({ conditions: createdConditions, limit: input.limit }),
		]);

		const allTasks = [...assignedTasks, ...createdTasks];
		const uniqueProjectIds = [...new Set(allTasks.map(t => t.projectId))];

		const projectAccessResults = await Promise.all(
			uniqueProjectIds.map(async projectId => {
				try {
					const access = await getProjectAccess({
						projectId,
						userId: currentUserId,
					});
					return [projectId, access] as const;
				} catch {
					return [projectId, null] as const;
				}
			}),
		);

		const projectAccessMap = Object.fromEntries(
			projectAccessResults.filter(([, access]) => access !== null),
		);

		const mapTaskForUser = (row: (typeof allTasks)[number]) => {
			const permissions = projectAccessMap[row.projectId];
			if (!permissions) return null;
			return mapTask(row, permissions, currentUserId);
		};

		return {
			assigned: assignedTasks.map(mapTaskForUser).filter(t => t !== null),
			created: createdTasks.map(mapTaskForUser).filter(t => t !== null),
		};
	});
