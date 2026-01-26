import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { organizationMembers } from '@/db/schema/organization-members';
import { organizations } from '@/db/schema/organizations';
import { protectedProcedure } from '@/trpc/init';

import { updateOrgRuleSchema } from '../schemas/update-org-rule-schema';

export const updateRule = protectedProcedure
	.input(
		z.object({
			id: z.string(),
			data: updateOrgRuleSchema,
		}),
	)
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [existingMember] = await db
			.select()
			.from(organizationMembers)
			.where(
				and(
					eq(organizationMembers.userId, userId),
					eq(organizationMembers.organizationId, input.id),
				),
			)
			.limit(1);

		if (!existingMember || existingMember.role !== 'admin') {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'common.access_denied',
			});
		}

		const [updatedOrg] = await db
			.update(organizations)
			.set({
				[input.data.rule]: input.data.value,
			})
			.where(eq(organizations.id, input.id))
			.returning();

		if (!updatedOrg) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'orgs.not_found',
			});
		}

		return { message: 'Success' };
	});
