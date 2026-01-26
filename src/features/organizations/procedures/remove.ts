import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { organizationMembers } from '@/db/schema/organization-members';
import { organizations } from '@/db/schema/organizations';
import { protectedProcedure } from '@/trpc/init';

export const remove = protectedProcedure
	.input(
		z.object({
			id: z.string(),
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

		const [removedOrg] = await db
			.delete(organizations)
			.where(eq(organizations.id, input.id))
			.returning();

		if (!removedOrg) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'orgs.not_found',
			});
		}

		return {
			id: removedOrg.id,
			name: removedOrg.name,
		};
	});
