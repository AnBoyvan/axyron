import { TRPCError } from '@trpc/server';
import { and, between, eq, getTableColumns } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import { meetings } from '@/db/schema/meetings';
import { organizationMembers } from '@/db/schema/organization-members';
import { organizations } from '@/db/schema/organizations';
import { resolveDateRange } from '@/lib/utils/resolve-week-range';
import { protectedProcedure } from '@/trpc/init';

import { getMeetingQuery } from '../utils/get-meetings-query';

export const getByOrganization = protectedProcedure
	.input(
		z.object({
			organizationId: z.string(),
			dateFrom: z.coerce.date().optional(),
			dateTo: z.coerce.date().optional(),
		}),
	)
	.query(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [orgData] = await db
			.select({
				org: getTableColumns(organizations),
				member: getTableColumns(organizationMembers),
			})
			.from(organizations)
			.innerJoin(
				organizationMembers,
				and(
					eq(organizationMembers.organizationId, organizations.id),
					eq(organizationMembers.userId, userId),
				),
			)
			.where(eq(organizations.id, input.organizationId))
			.limit(1);

		if (!orgData) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'orgs.not_found',
			});
		}

		const { dateFrom, dateTo } = resolveDateRange(input.dateFrom, input.dateTo);

		const data = await getMeetingQuery({
			userId,
			conditions: [
				eq(meetings.organizationId, input.organizationId),
				between(meetings.startTime, dateFrom, dateTo),
			],
		});

		return data;
	});
