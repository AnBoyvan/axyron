// features/tasks/procedures/get-for-calendar.ts
import { and, between, eq, inArray, or, sql } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import { assignees } from '@/db/schema/assignees';
import { tasks } from '@/db/schema/tasks';
import { getProjectAccess } from '@/features/projects/utils/get-project-access';
import { resolveDateRange } from '@/lib/utils/resolve-week-range';
import { protectedProcedure } from '@/trpc/init';

import { getTasksQuery } from '../utils/get-tasks-by-query';
import { mapTask } from '../utils/map-tasks';

export const getForCalendar = protectedProcedure
	.input(
		z.object({
			organizationId: z.string().optional(),
			dateFrom: z.coerce.date().optional(),
			dateTo: z.coerce.date().optional(),
		}),
	)
	.query(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const { dateFrom, dateTo } = resolveDateRange(input.dateFrom, input.dateTo);

		const userAssignments = await db
			.select({ taskId: assignees.taskId })
			.from(assignees)
			.where(eq(assignees.userId, userId));

		const taskIds = userAssignments.map(a => a.taskId);

		const dateCondition = or(
			between(tasks.startDate, dateFrom, dateTo),
			between(tasks.dueDate, dateFrom, dateTo),
		)!;

		const orgCondition = input.organizationId
			? eq(tasks.organizationId, input.organizationId)
			: undefined;

		const allTasks = await getTasksQuery({
			conditions: [
				and(
					dateCondition,
					orgCondition,
					or(
						taskIds.length ? inArray(tasks.id, taskIds) : sql`false`,
						eq(tasks.createdBy, userId),
					),
				)!,
			],
		});

		const uniqueProjectIds = [...new Set(allTasks.map(t => t.projectId))];

		const projectAccessResults = await Promise.all(
			uniqueProjectIds.map(async projectId => {
				try {
					const access = await getProjectAccess({ projectId, userId });
					return [projectId, access] as const;
				} catch {
					return [projectId, null] as const;
				}
			}),
		);

		const projectAccessMap = Object.fromEntries(
			projectAccessResults.filter(([, access]) => access !== null),
		);

		return allTasks
			.map(row => {
				const permissions = projectAccessMap[row.projectId];
				if (!permissions) return null;
				return mapTask(row, permissions, userId);
			})
			.filter(t => t !== null);
	});
