import { and, asc, eq, inArray, type SQL, sql } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { assignees } from '@/db/schema/assignees';
import { comments } from '@/db/schema/comments';
import { organizations } from '@/db/schema/organizations';
import { projects } from '@/db/schema/projects';
import { tasks } from '@/db/schema/tasks';
import { protectedProcedure } from '@/trpc/init';

import { resolveTaskStatus } from '../utils/resolve-task-status';

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

		const tasksQuery = (conditions: SQL[]) => {
			const query = db
				.select({
					task: tasks,
					project: {
						id: projects.id,
						name: projects.name,
					},
					organization: {
						id: organizations.id,
						name: organizations.name,
						image: organizations.image,
					},
					assignees: sql<
						{
							userId: string;
							name: string;
							email: string;
							image: string | null;
						}[]
					>`
          coalesce(
            jsonb_agg(
              distinct jsonb_build_object(
                'userId', assignee_user.id,
                'name', assignee_user.name,
                'email', assignee_user.email,
                'image', assignee_user.image
              )
            ) filter (where assignee_user.id is not null),
            '[]'::jsonb
          )
        `,
					subtasks: sql<
						{
							id: string;
							title: string;
							position: number;
							completed: boolean;
							createdAt: Date;
							updatedAt: Date;
						}[]
					>`
          coalesce(
            (
              select jsonb_agg(
                jsonb_build_object(
                  'id', s.id,
                  'title', s.title,
                  'position', s.position,
                  'completed', s.completed,
                  'createdAt', s.created_at,
                  'updatedAt', s.updated_at
                )
                order by s.position
              )
              from subtasks s
              where s.task_id = ${tasks.id}
            ),
            '[]'::jsonb
          )
        `,
					commentsCount: db.$count(comments, eq(comments.taskId, tasks.id)),
				})
				.from(tasks)
				.innerJoin(projects, eq(projects.id, tasks.projectId))
				.innerJoin(organizations, eq(organizations.id, tasks.organizationId))
				.leftJoin(assignees, eq(assignees.taskId, tasks.id))
				.leftJoin(
					sql`"user" as assignee_user`,
					sql`assignee_user.id = ${assignees.userId}`,
				)
				.where(and(...conditions))
				.groupBy(tasks.id, projects.id, organizations.id)
				.orderBy(asc(tasks.createdAt));

			return input.limit ? query.limit(input.limit) : query;
		};

		const [assignedTasks, createdTasks] = await Promise.all([
			tasksQuery(assignedConditions),
			tasksQuery(createdConditions),
		]);

		const assigned = assignedTasks.map(row => ({
			...row.task,
			status: resolveTaskStatus({
				status: row.task.status,
				dueDate: row.task.dueDate,
			}),
			link: `/org/${row.task.organizationId}/projects/${row.task.projectId}/tasks/${row.task.id}`,
			project: row.project,
			organization: row.organization,
			assignees: row.assignees,
			subtasks: row.subtasks,
		}));

		const created = createdTasks.map(row => ({
			...row.task,
			status: resolveTaskStatus({
				status: row.task.status,
				dueDate: row.task.dueDate,
			}),
			link: `/org/${row.task.organizationId}/projects/${row.task.projectId}/tasks/${row.task.id}`,
			project: row.project,
			organization: row.organization,
			assignees: row.assignees,
			subtasks: row.subtasks,
		}));

		return { assigned, created };
	});
