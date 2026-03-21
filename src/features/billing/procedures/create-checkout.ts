import { TRPCError } from '@trpc/server';
import { and, eq, getTableColumns } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { organizationMembers } from '@/db/schema/organization-members';
import { organizations } from '@/db/schema/organizations';
import { protectedProcedure } from '@/trpc/init';
import { polar } from '@/lib/polar/client';

const PRODUCT_IDS = {
	basic: process.env.POLAR_BASIC_PRODUCT_ID,
	pro: process.env.POLAR_PRO_PRODUCT_ID,
} as const;

export const createCheckout = protectedProcedure
	.input(
		z.object({
			organizationId: z.string(),
			plan: z.enum(['basic', 'pro']),
		}),
	)
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

		const checkout = await polar.checkouts.create({
			products: [PRODUCT_IDS[input.plan]],
			successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/org/${input.organizationId}/billing?success=true`,
			metadata: {
				organizationId: input.organizationId,
			},
		});

		return { url: checkout.url };
	});
