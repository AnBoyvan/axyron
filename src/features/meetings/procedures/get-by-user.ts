import { between } from 'drizzle-orm';
import z from 'zod';

import { meetings } from '@/db/schema/meetings';
import { resolveDateRange } from '@/lib/utils/resolve-week-range';
import { protectedProcedure } from '@/trpc/init';

import { getMeetingQuery } from '../utils/get-meetings-query';

export const getByUser = protectedProcedure
	.input(
		z.object({
			dateFrom: z.coerce.date().optional(),
			dateTo: z.coerce.date().optional(),
		}),
	)
	.query(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const { dateFrom, dateTo } = resolveDateRange(input.dateFrom, input.dateTo);

		const data = await getMeetingQuery({
			userId,
			conditions: [between(meetings.startTime, dateFrom, dateTo)],
		});

		return data;
	});
