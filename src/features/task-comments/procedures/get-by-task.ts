import { TRPCError } from '@trpc/server';
import {
	and,
	count,
	desc,
	eq,
	isNotNull,
	isNull,
	lt,
	or,
	sql,
} from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import { comments } from '@/db/schema/comments';
import { tasks } from '@/db/schema/tasks';
import { user } from '@/db/schema/user';
import { getProjectAccess } from '@/features/projects/utils/get-project-access';
import { protectedProcedure } from '@/trpc/init';

import { DEFAULT_COMMENTS_LIMIT, MAX_COMMENTS_LIMIT } from '../constants';
import type { Reaction } from '../types';

export const getByTask = protectedProcedure
	.input(
		z.object({
			taskId: z.string(),
			parentId: z.string().nullish(),
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
		const { taskId, cursor, limit, parentId } = input;

		const [existingTask] = await db
			.select({ projectId: tasks.projectId })
			.from(tasks)
			.where(eq(tasks.id, taskId))
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

		const repliesCte = db.$with('replies').as(
			db
				.select({
					parentId: comments.parentId,
					count: count(comments.id).as('count'),
				})
				.from(comments)
				.where(and(eq(comments.taskId, taskId), isNotNull(comments.parentId)))
				.groupBy(comments.parentId),
		);

		const [{ total }] = await db
			.select({ total: count(comments.id) })
			.from(comments)
			.where(eq(comments.taskId, taskId));

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
				replyCount: repliesCte.count,
				reactions: sql<Reaction[]>`
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
					eq(comments.taskId, taskId),
					parentId
						? eq(comments.parentId, parentId)
						: isNull(comments.parentId),
					cursor
						? or(
								lt(comments.createdAt, cursor.createdAt),
								and(
									eq(comments.createdAt, cursor.createdAt),
									lt(comments.id, cursor.id),
								),
							)
						: undefined,
				),
			)
			.orderBy(desc(comments.createdAt), desc(comments.id))
			.limit(limit + 1);

		const hasMore = data.length > limit;
		const items = hasMore ? data.slice(0, limit) : data;
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
				replyCount: item.replyCount ?? 0,
				reactions: item.reactions,
			})),
			total,
			nextCursor,
		};
	});
