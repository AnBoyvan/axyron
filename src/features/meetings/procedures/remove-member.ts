import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { meetingMembers } from '@/db/schema/meeting-members';
import { protectedProcedure } from '@/trpc/init';

import { getMeetingAccess } from '../utils/get-meeting-access';

export const removeMember = protectedProcedure
	.input(z.object({ meetingId: z.string(), userId: z.string() }))
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;
		const { meetingId } = input;

		const { isAdmin } = await getMeetingAccess({
			meetingId,
			userId,
		});

		if (!isAdmin) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'common.access_denied',
			});
		}

		const [deletedMember] = await db
			.delete(meetingMembers)
			.where(
				and(
					eq(meetingMembers.meetingId, input.meetingId),
					eq(meetingMembers.userId, input.userId),
				),
			)
			.returning();

		return deletedMember;
	});
