import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { meetings } from '@/db/schema/meetings';
import { protectedProcedure } from '@/trpc/init';

import { getMeetingAccess } from '../utils/get-meeting-access';

export const remove = protectedProcedure
	.input(z.object({ meetingId: z.string() }))
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;
		const { meetingId } = input;

		const [existingMeeting] = await db
			.select()
			.from(meetings)
			.where(eq(meetings.id, input.meetingId))
			.limit(1);

		if (!existingMeeting) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'meetings.not_found',
			});
		}

		const { isAdmin } = await getMeetingAccess({
			userId,
			meetingId,
		});

		if (!isAdmin) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'common.access_denied',
			});
		}

		const [deletedMeeting] = await db
			.delete(meetings)
			.where(eq(meetings.id, input.meetingId))
			.returning();

		return deletedMeeting;
	});
