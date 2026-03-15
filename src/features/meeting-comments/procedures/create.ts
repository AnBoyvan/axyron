import { TRPCError } from '@trpc/server';
import z from 'zod';

import { db } from '@/db';
import { meetingComments } from '@/db/schema/meeting-comments';
import { getMeetingAccess } from '@/features/meetings/utils/get-meeting-access';
import { protectedProcedure } from '@/trpc/init';

import { MAX_MEETING_COMMENT_SIZE } from '../constants';

export const create = protectedProcedure
	.input(
		z.object({
			meetingId: z.string(),
			content: z.string().min(1).max(MAX_MEETING_COMMENT_SIZE),
		}),
	)
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;
		const { meetingId } = input;

		const { canComment } = await getMeetingAccess({
			meetingId,
			userId,
		});

		if (!canComment) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'common.access_denied',
			});
		}

		const [createdComment] = await db
			.insert(meetingComments)
			.values({
				meetingId,
				userId,
				content: input.content,
			})
			.returning();

		return createdComment;
	});
