import { TRPCError } from '@trpc/server';
import { and, eq, getTableColumns } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { organizationMembers } from '@/db/schema/organization-members';
import { organizations } from '@/db/schema/organizations';
import { polar } from '@/lib/polar/client';
import { protectedProcedure } from '@/trpc/init';

export const createPortal = protectedProcedure
	.input(z.object({ organizationId: z.string() }))
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [row] = await db
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

		if (!row) {
			throw new TRPCError({ code: 'NOT_FOUND', message: 'orgs.not_found' });
		}

		if (row.member.role !== 'admin') {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'common.access_denied',
			});
		}

		if (!row.org.polarSubscriptionId) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'billing.no_subscription',
			});
		}

		const subscription = await polar.subscriptions.get({
			id: row.org.polarSubscriptionId,
		});

		const session = await polar.customerSessions.create({
			customerId: subscription.customerId,
		});

		return { url: session.customerPortalUrl };
	});
