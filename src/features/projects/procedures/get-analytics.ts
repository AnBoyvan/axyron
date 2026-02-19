import { eq, sql } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { assignees } from '@/db/schema/assignees';
import { tasks } from '@/db/schema/tasks';
import { protectedProcedure } from '@/trpc/init';

import { getProjectAccess } from '../../projects/utils/get-project-access';

export const getAnalytics = protectedProcedure
	.input(z.object({ projectId: z.string() }))
	.query(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const { project, ...permissions } = await getProjectAccess({
			projectId: input.projectId,
			userId,
		});

		const baseCondition = eq(tasks.projectId, input.projectId);

		const [summaryRows, assigneeRows] = await Promise.all([
			db
				.select({
					total: sql<number>`(count(*))::int`,

					pending: sql<number>`
            (count(*) filter (where status = 'pending'))::int
          `,
					inProgress: sql<number>`
            (count(*) filter (where status = 'in_progress'))::int
          `,
					inReview: sql<number>`
            (count(*) filter (where status = 'in_review'))::int
          `,
					completed: sql<number>`
            (count(*) filter (where status = 'completed'))::int
          `,
					cancelled: sql<number>`
            (count(*) filter (where status = 'cancelled'))::int
          `,
					overdue: sql<number>`
            (
              count(*) filter (
                where status not in ('completed','cancelled')
                and due_date is not null
                and due_date < now()
              )
            )::int
          `,
					low: sql<number>`
            (count(*) filter (where priority = 'low'))::int
          `,
					medium: sql<number>`
            (count(*) filter (where priority = 'medium'))::int
          `,
					high: sql<number>`
            (count(*) filter (where priority = 'high'))::int
          `,
					critical: sql<number>`
            (count(*) filter (where priority = 'critical'))::int
          `,
				})
				.from(tasks)
				.where(baseCondition),
			db
				.select({
					userId: assignees.userId,

					total: sql<number>`
            (count(distinct ${tasks.id}))::int
          `,
					pending: sql<number>`
            (
              count(distinct ${tasks.id})
              filter (where ${tasks.status} = 'pending')
            )::int
          `,
					inProgress: sql<number>`
            (
              count(distinct ${tasks.id})
              filter (where ${tasks.status} = 'in_progress')
            )::int
          `,
					inReview: sql<number>`
            (
              count(distinct ${tasks.id})
              filter (where ${tasks.status} = 'in_review')
            )::int
          `,
					completed: sql<number>`
            (
              count(distinct ${tasks.id})
              filter (where ${tasks.status} = 'completed')
            )::int
          `,
					cancelled: sql<number>`
            (
              count(distinct ${tasks.id})
              filter (where ${tasks.status} = 'cancelled')
            )::int
          `,
				})
				.from(assignees)
				.innerJoin(tasks, eq(tasks.id, assignees.taskId))
				.where(baseCondition)
				.groupBy(assignees.userId),
		]);

		const summary = summaryRows[0];

		return {
			project,
			permissions,
			summary: {
				total: summary.total,
				byStatus: {
					pending: summary.pending,
					in_progress: summary.inProgress,
					in_review: summary.inReview,
					completed: summary.completed,
					cancelled: summary.cancelled,
					overdue: summary.overdue,
				},
				byPriority: {
					low: summary.low,
					medium: summary.medium,
					high: summary.high,
					critical: summary.critical,
				},
			},
			byAssignee: assigneeRows,
		};
	});
