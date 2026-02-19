import { TRPCError } from '@trpc/server';
import { and, desc, eq, lt, or, sql } from 'drizzle-orm';
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

		const data = await db
			.select({
				comment: comments,
				author: {
					id: user.id,
					name: user.name,
					email: user.email,
					image: user.image,
					position: user.position,
				},
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
			.where(and(...conditions))
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
