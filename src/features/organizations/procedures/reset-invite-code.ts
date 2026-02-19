import { TRPCError } from '@trpc/server';
import { and, eq, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import z from 'zod';

import { db } from '@/db';
import { organizationMembers } from '@/db/schema/organization-members';
import { organizations } from '@/db/schema/organizations';
import { protectedProcedure } from '@/trpc/init';

export const resetInviteCode = protectedProcedure
	.input(z.object({ organizationId: z.string() }))
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [row] = await db
			.select({ memberRole: organizationMembers.role })
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
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'orgs.not_found',
			});
		}

		const [updated] = await db
			.update(organizationMembers)
			.set({
				inviteCode: nanoid(),
				updatedAt: sql`now()`,
			})
			.where(
				and(
					eq(organizationMembers.userId, userId),
					eq(organizationMembers.organizationId, input.organizationId),
				),
			)
			.returning({ inviteCode: organizationMembers.inviteCode });

		return {
			inviteCode: updated.inviteCode,
			organizationId: input.organizationId,
		};
	});
