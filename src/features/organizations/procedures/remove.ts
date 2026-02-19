import { TRPCError } from '@trpc/server';
import { and, eq, getTableColumns } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { organizationMembers } from '@/db/schema/organization-members';
import { organizations } from '@/db/schema/organizations';
import { protectedProcedure } from '@/trpc/init';

export const remove = protectedProcedure
	.input(z.object({ id: z.string() }))
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [row] = await db
			.select({
				org: getTableColumns(organizations),
				memberRole: organizationMembers.role,
			})
			.from(organizations)
			.innerJoin(
				organizationMembers,
				and(
					eq(organizationMembers.organizationId, organizations.id),
					eq(organizationMembers.userId, userId),
				),
			)
			.where(eq(organizations.id, input.id))
			.limit(1);

		if (!row) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'orgs.not_found',
			});
		}

		if (row.memberRole !== 'admin') {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'common.access_denied',
			});
		}

		const [removedOrg] = await db
			.delete(organizations)
			.where(eq(organizations.id, input.id))
			.returning();

		return {
			id: removedOrg.id,
			name: removedOrg.name,
		};
	});
