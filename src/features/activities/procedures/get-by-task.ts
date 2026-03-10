import { and, desc, eq, lt, or, sql } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { activities } from '@/db/schema/activities';
import { projects } from '@/db/schema/projects';
import { tasks } from '@/db/schema/tasks';
import { user } from '@/db/schema/user';
import { protectedProcedure } from '@/trpc/init';

import { DEFAULT_ACTIVITIES_LIMIT, MAX_ACTIVITIES_LIMIT } from '../constants';

export const getByTask = protectedProcedure
	.input(
		z.object({
			taskId: z.string(),
			limit: z
				.number()
				.min(1)
				.max(MAX_ACTIVITIES_LIMIT)
				.default(DEFAULT_ACTIVITIES_LIMIT),
			cursor: z
				.object({
					id: z.string(),
					createdAt: z.date(),
				})
				.nullish(),
		}),
	)
	.query(async ({ input }) => {
		const conditions = [eq(activities.taskId, input.taskId)];

		if (input.cursor) {
			conditions.push(
				or(
					lt(activities.createdAt, input.cursor.createdAt),
					and(
						eq(activities.createdAt, input.cursor.createdAt),
						lt(activities.id, input.cursor.id),
					),
				)!,
			);
		}

		const data = await db
			.select({
				activity: activities,
				project: {
					id: projects.id,
					name: projects.name,
				},
				task: {
					id: tasks.id,
					title: tasks.title,
				},
				author: {
					id: user.id,
					name: user.name,
					email: user.email,
					image: user.image,
				},
				entityProject: {
					id: sql<string | null>`ep.id`,
					name: sql<string | null>`ep.name`,
				},
				entityTask: {
					id: sql<string | null>`et.id`,
					title: sql<string | null>`et.title`,
				},
				entitySubtask: {
					id: sql<string | null>`es.id`,
					title: sql<string | null>`es.title`,
				},
				entityUser: {
					id: sql<string | null>`eu.id`,
					name: sql<string | null>`eu.name`,
					email: sql<string | null>`eu.email`,
					image: sql<string | null>`eu.image`,
				},
			})
			.from(activities)
			.innerJoin(projects, eq(projects.id, activities.projectId))
			.leftJoin(tasks, eq(tasks.id, activities.taskId))
			.leftJoin(user, eq(user.id, activities.authorId))
			.leftJoin(
				sql`projects ep`,
				sql`ep.id = ${activities.entityId}
            and ${activities.entityType} = 'project'`,
			)
			.leftJoin(
				sql`tasks et`,
				sql`et.id = ${activities.entityId}
            and ${activities.entityType} = 'task'`,
			)
			.leftJoin(
				sql`subtasks es`,
				sql`es.id = ${activities.entityId}
            and ${activities.entityType} = 'subtask'`,
			)
			.leftJoin(
				sql`"user" eu`,
				sql`eu.id = ${activities.entityId}
            and ${activities.entityType} = 'user'`,
			)
			.where(and(...conditions))
			.orderBy(desc(activities.createdAt), desc(activities.id))
			.limit(input.limit + 1);

		const hasMore = data.length > input.limit;
		const items = hasMore ? data.slice(0, -1) : data;

		const lastItem = items[items.length - 1];

		const nextCursor = hasMore
			? {
					id: lastItem.activity.id,
					createdAt: lastItem.activity.createdAt,
				}
			: null;

		return {
			items: items.map(item => {
				let entity = null;

				if (item.entityProject.id) entity = item.entityProject;
				else if (item.entityTask.id) entity = item.entityTask;
				else if (item.entitySubtask.id) entity = item.entitySubtask;
				else if (item.entityUser.id) entity = item.entityUser;

				return {
					...item.activity,
					project: item.project,
					task: item.task,
					author: item.author,
					entity,
				};
			}),
			nextCursor,
		};
	});
