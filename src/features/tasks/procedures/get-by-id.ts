import { TRPCError } from '@trpc/server';
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

export const getById = protectedProcedure
	.input(z.object({ taskId: z.string() }))
	.query(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [row] = await db
			.select({
				task: tasks,
				creator: {
					id: user.id,
					name: user.name,
					email: user.email,
					image: user.image,
				},
				assignees: sql<
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
			.leftJoin(user, eq(user.id, tasks.createdBy))
			.leftJoin(assignees, eq(assignees.taskId, tasks.id))
			.leftJoin(
				sql`(select * from ${user}) as assignee_user`,
				sql`assignee_user.id = ${assignees.userId}`,
			)
			.leftJoin(subtasks, eq(subtasks.taskId, tasks.id))
			.where(eq(tasks.id, input.taskId))
			.groupBy(tasks.id, user.id)
			.limit(1);

		if (!row) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'tasks.not_found',
			});
		}

		const permissions = await getProjectAccess({
			projectId: row.task.projectId,
			userId,
		});

		return {
			...row.task,
			creator: row.creator,
			assignees: row.assignees,
			subtasks: row.subtasks,
			permissions,
		};
	});
