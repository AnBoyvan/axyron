import { TRPCError } from '@trpc/server';
import { and, eq, getTableColumns } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { meetingComments } from '@/db/schema/meeting-comments';
import { meetings } from '@/db/schema/meetings';
import { organizationMembers } from '@/db/schema/organization-members';
import { MAX_COMMENT_SIZE } from '@/features/task-comments/constants';
import { protectedProcedure } from '@/trpc/init';

export const addComment = protectedProcedure
	.input(
		z.object({
			meetingId: z.string(),
			content: z.string().min(1).max(MAX_COMMENT_SIZE),
		}),
	)
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [existingMeeting] = await db
			.select({
				...getTableColumns(meetings),
				member: organizationMembers,
			})
			.from(meetings)
			.innerJoin(
				organizationMembers,
				and(
					eq(organizationMembers.userId, userId),
					eq(organizationMembers.organizationId, meetings.organizationId),
				),
			)
			.where(eq(meetings.id, input.meetingId))
			.limit(1);

		if (!existingMeeting) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'meetings.not_found',
			});
		}

		const [createdComment] = await db
			.insert(meetingComments)
			.values({
				meetingId: input.meetingId,
				userId,
				content: input.content,
			})
			.returning();

		return createdComment;
	});
