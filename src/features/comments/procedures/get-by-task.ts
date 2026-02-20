import { TRPCError } from '@trpc/server';
import { and, desc, eq, isNotNull, lt, or, sql } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import { comments } from '@/db/schema/comments';
import { tasks } from '@/db/schema/tasks';
import { user } from '@/db/schema/user';
import { getProjectAccess } from '@/features/projects/utils/get-project-access';
import { protectedProcedure } from '@/trpc/init';

import { DEFAULT_COMMENTS_LIMIT, MAX_COMMENTS_LIMIT } from '../constants';

export const getByTask = protectedProcedure
	.input(
		z.object({
			taskId: z.string(),
			limit: z
				.number()
				.min(1)
				.max(MAX_COMMENTS_LIMIT)
				.default(DEFAULT_COMMENTS_LIMIT),
			cursor: z
				.object({
					id: z.string(),
					createdAt: z.date(),
				})
				.nullish(),
		}),
	)
	.query(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [existingTask] = await db
			.select({ projectId: tasks.projectId })
			.from(tasks)
			.where(eq(tasks.id, input.taskId))
			.limit(1);

		if (!existingTask) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'tasks.not_found',
			});
		}

		await getProjectAccess({
			projectId: existingTask.projectId,
			userId,
		});

		const conditions = [eq(comments.taskId, input.taskId)];

		if (input.cursor) {
			conditions.push(
				or(
					lt(comments.createdAt, input.cursor.createdAt),
					and(
						eq(comments.createdAt, input.cursor.createdAt),
						lt(comments.id, input.cursor.id),
					),
				)!,
			);
		}

		const repliesCte = db.$with('replies_cte').as(
			db
				.select({
					parentId: comments.parentId,
					replies: sql<
						{
							id: string;
							content: string;
							edited: boolean;
							createdAt: Date;
							updatedAt: Date;
							author: {
								id: string;
								name: string;
								email: string;
								image: string | null;
								position: string | null;
							};
						}[]
					>`
        json_agg(
          jsonb_build_object(
            'id', c.id,
            'content', c.content,
            'edited', c.edited,
            'createdAt', c.created_at,
            'updatedAt', c.updated_at,
            'author', jsonb_build_object(
              'id', u.id,
              'name', u.name,
              'email', u.email,
              'image', u.image,
              'position', u.position
            )
          )
          order by c.created_at asc
        )
      `,
				})
				.from(sql`comments c`)
				.innerJoin(user, eq(user.id, sql`c.user_id`))
				.where(
					and(eq(sql`c.task_id`, input.taskId), isNotNull(sql`c.parent_id`)),
				)
				.groupBy(sql`c.parent_id`),
		);

		const data = await db
			.with(repliesCte)
			.select({
				comment: comments,
				author: {
					id: user.id,
					name: user.name,
					email: user.email,
					image: user.image,
					position: user.position,
				},
				replies: sql<
					{
						id: string;
						content: string;
						edited: boolean;
						createdAt: Date;
						updatedAt: Date;
						author: {
							id: string;
							name: string;
							email: string;
							image: string | null;
							position: string | null;
						};
					}[]
				>`coalesce(${repliesCte.replies}, '[]'::json)`,
				reactions: sql<
					{
						emoji: string;
						count: number;
						userReacted: boolean;
					}[]
				>`
      coalesce(
        (
          select json_agg(
            jsonb_build_object(
              'emoji', r.emoji,
              'count', r.reaction_count,
              'userReacted', r.user_reacted
            )
          )
          from (
            select 
              cr.emoji,
              count(*)::int as reaction_count,
              bool_or(cr.user_id = ${userId}) as user_reacted
            from comment_reactions cr
            where cr.comment_id = ${comments.id}
            group by cr.emoji
          ) r
        ),
        '[]'::json
      )
    `,
			})
			.from(comments)
			.innerJoin(user, eq(user.id, comments.userId))
			.leftJoin(repliesCte, eq(comments.id, repliesCte.parentId))
			.where(
				and(
					eq(comments.taskId, input.taskId),
					sql`${comments.parentId} is null`,
					...conditions.slice(1),
				),
			)
			.orderBy(desc(comments.createdAt), desc(comments.id))
			.limit(input.limit + 1);

		const hasMore = data.length > input.limit;
		const items = hasMore ? data.slice(0, input.limit) : data;
		const lastItem = items.at(-1);
		const nextCursor =
			hasMore && lastItem
				? {
						id: lastItem.comment.id,
						createdAt: lastItem.comment.createdAt,
					}
				: null;

		return {
			items: items.map(item => ({
				...item.comment,
				author: item.author,
				reactions: item.reactions,
			})),
			nextCursor,
		};
	});
