import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { meetingMembers } from '@/db/schema/meeting-members';
import { meetings } from '@/db/schema/meetings';
import { protectedProcedure } from '@/trpc/init';

import { getMeetingAccess } from '../utils/get-meeting-access';

export const invite = protectedProcedure
	.input(z.object({ meetingId: z.string(), userIds: z.array(z.string()) }))
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

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
			meetingId: existingMeeting.id,
			userId,
		});

		if (!isAdmin) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'common.access_denied',
			});
		}

		await db
			.insert(meetingMembers)
			.values(
				input.userIds.map(id => ({
					userId: id,
					meetingId: input.meetingId,
					organizationId: existingMeeting.organizationId,
					status: 'pending' as const,
				})),
			)
			.onConflictDoNothing()
			.returning({ userId: meetingMembers.userId });

		return existingMeeting;
	});
