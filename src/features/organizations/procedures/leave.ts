import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { organizationMembers } from '@/db/schema/organization-members';
import { organizations } from '@/db/schema/organizations';
import { protectedProcedure } from '@/trpc/init';

export const leave = protectedProcedure
	.input(z.object({ organizationId: z.string() }))
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [org] = await db
			.select({
				memberRole: organizationMembers.role,
				orgName: organizations.name,
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

		if (!org) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'orgs.not_found',
			});
		}

		if (org.memberRole === 'admin') {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'members.admin_cannot_leave',
			});
		}

		await db
			.delete(organizationMembers)
			.where(
				and(
					eq(organizationMembers.userId, userId),
					eq(organizationMembers.organizationId, input.organizationId),
				),
			);

		return {
			organizationId: input.organizationId,
			organizationName: org.orgName,
		};
	});
