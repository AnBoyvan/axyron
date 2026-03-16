import { and, desc, eq, getTableColumns, type SQL, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

import { db } from '@/db';
import { assignees } from '@/db/schema/assignees';
import { comments } from '@/db/schema/comments';
import { organizations } from '@/db/schema/organizations';
import { projects } from '@/db/schema/projects';
import { subtasks } from '@/db/schema/subtasks';
import { tasks } from '@/db/schema/tasks';
import { user } from '@/db/schema/user';

interface GetTasksQueryProps {
	conditions: SQL[];
	limit?: number;
}

export const getTasksQuery = async ({
	conditions,
	limit,
}: GetTasksQueryProps) => {
	const assigneeUser = alias(user, 'assignee_user');

	const query = db
		.select({
			...getTableColumns(tasks),
			project: {
				...getTableColumns(projects),
			},
			organization: {
				...getTableColumns(organizations),
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
		.leftJoin(subtasks, eq(subtasks.taskId, tasks.id))
		.leftJoin(assignees, eq(assignees.taskId, tasks.id))
		.leftJoin(assigneeUser, eq(assigneeUser.id, assignees.userId))
		.leftJoin(user, eq(user.id, tasks.createdBy))
		.where(and(...conditions))
		.groupBy(tasks.id, projects.id, organizations.id)
		.orderBy(desc(tasks.createdAt), desc(tasks.id));

	return limit ? query.limit(limit) : query;
};
