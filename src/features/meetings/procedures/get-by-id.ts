import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { meetings } from '@/db/schema/meetings';
import { protectedProcedure } from '@/trpc/init';

import { getMeetingQuery } from '../utils/get-meetings-query';

export const getById = protectedProcedure
	.input(z.object({ meetingId: z.string() }))
	.query(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [data] = await getMeetingQuery({
			userId,
			conditions: [eq(meetings.id, input.meetingId)],
			limit: 1,
		});

		if (!data) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'meetings.not_found',
			});
		}

		return data;
	});
