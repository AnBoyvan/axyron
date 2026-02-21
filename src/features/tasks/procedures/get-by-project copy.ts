import { eq, sql } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { assignees } from '@/db/schema/assignees';
import { comments } from '@/db/schema/comments';
import { subtasks } from '@/db/schema/subtasks';
import { tasks } from '@/db/schema/tasks';
import { user } from '@/db/schema/user';
import { getProjectAccess } from '@/features/projects/utils/get-project-access';
import { protectedProcedure } from '@/trpc/init';

export const getByProject = protectedProcedure
	.input(z.object({ projectId: z.string() }))
	.query(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const permissions = await getProjectAccess({
			projectId: input.projectId,
			userId,
		});

		const projectTasks = await db
			.select({
				task: tasks,
				assigned: sql<
					Array<{
						userId: string;
						name: string;
						email: string;
						image: string | null;
					}>
				>`
					coalesce(
						json_agg(
							distinct jsonb_build_object(
								'userId', ${assignees.userId},
								'name', ${user.name},
								'email', ${user.email},
								'image', ${user.image}
							)
						) filter (where ${assignees.userId} is not null),
						'[]'
					)
				`,
				subtasks: sql<
					Array<{
						id: string;
						title: string;
						position: number;
						completed: boolean;
						createdAt: Date;
						updatedAt: Date;
					}>
				>`
					coalesce(
						json_agg(
							distinct jsonb_build_object(
								'id', ${subtasks.id},
								'title', ${subtasks.title},
								'position', ${subtasks.position},
								'completed', ${subtasks.completed},
								'createdAt', ${subtasks.createdAt},
								'updatedAt', ${subtasks.updatedAt}
							)
							order by ${subtasks.position}
						) filter (where ${subtasks.id} is not null),
						'[]'
					)
				`,
				commentsCount: db.$count(comments, eq(comments.taskId, tasks.id)),
			})
			.from(tasks)
			.leftJoin(assignees, eq(assignees.taskId, tasks.id))
			.leftJoin(
				sql`(select * from ${user}) as assignee_user`,
				sql`assignee_user.id = ${assignees.userId}`,
			)
			.leftJoin(subtasks, eq(subtasks.taskId, tasks.id))
			.where(eq(tasks.projectId, input.projectId))
			.groupBy(tasks.id)
			.orderBy(tasks.createdAt);

		return {
			tasks: projectTasks.map(row => ({
				...row.task,
				assignees: row.assigned,
				subtasks: row.subtasks,
			})),
			permissions,
		};
	});
