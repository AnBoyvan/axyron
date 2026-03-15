import { TRPCError } from '@trpc/server';
import {
	and,
	count,
	desc,
	eq,
	getTableColumns,
	lt,
	or,
	sql,
} from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import { meetingComments } from '@/db/schema/meeting-comments';
import { meetings } from '@/db/schema/meetings';
import { user } from '@/db/schema/user';
import { protectedProcedure } from '@/trpc/init';

import {
	DEFAULT_MEETING_COMMENTS_LIMIT,
	MAX_MEETING_COMMENTS_LIMIT,
} from '../constants';
import type { MeetingCommentReaction } from '../types';

export const getByMeeting = protectedProcedure
	.input(
		z.object({
			meetingId: z.string(),
			limit: z
				.number()
				.min(1)
				.max(MAX_MEETING_COMMENTS_LIMIT)
				.default(DEFAULT_MEETING_COMMENTS_LIMIT),
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
		const { meetingId, cursor, limit } = input;

		const [existingMeeting] = await db
			.select()
			.from(meetings)
			.where(eq(meetings.id, meetingId))
			.limit(1);

		if (!existingMeeting) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'tasks.not_found',
			});
		}

		const [{ total }] = await db
			.select({ total: count(meetingComments.id) })
			.from(meetingComments)
			.where(eq(meetingComments.meetingId, meetingId));

		const data = await db
			.select({
				...getTableColumns(meetingComments),
				author: {
					id: user.id,
					name: user.name,
					email: user.email,
					image: user.image,
					position: user.position,
				},
				reactions: sql<MeetingCommentReaction[]>`
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
								from meeting_comment_reactions cr
								where cr.comment_id = ${meetingComments.id}
								group by cr.emoji
							) r
						),
						'[]'::json
					)
				`,
			})
			.from(meetingComments)
			.innerJoin(user, eq(user.id, meetingComments.userId))
			.where(
				and(
					eq(meetingComments.meetingId, meetingId),
					cursor
						? or(
								lt(meetingComments.createdAt, cursor.createdAt),
								and(
									eq(meetingComments.createdAt, cursor.createdAt),
									lt(meetingComments.id, cursor.id),
								),
							)
						: undefined,
				),
			)
			.orderBy(desc(meetingComments.createdAt), desc(meetingComments.id))
			.limit(limit + 1);

		const hasMore = data.length > limit;
		const items = hasMore ? data.slice(0, limit) : data;
		const lastItem = items.at(-1);
		const nextCursor =
			hasMore && lastItem
				? {
						id: lastItem.id,
						createdAt: lastItem.createdAt,
					}
				: null;

		return {
			items,
			total,
			nextCursor,
		};
	});
