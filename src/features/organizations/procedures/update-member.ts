import { TRPCError } from '@trpc/server';
import { and, eq, sql } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { organizationMembers } from '@/db/schema/organization-members';
import { organizations } from '@/db/schema/organizations';
import { protectedProcedure } from '@/trpc/init';

import { updateOrgMemberSchema } from '../schemas/update-org-member-schema';

export const updateMember = protectedProcedure
	.input(
		z.object({
			organizationId: z.string(),
			userId: z.string(),
			data: updateOrgMemberSchema,
		}),
	)
	.mutation(async ({ ctx, input }) => {
		const currentUserId = ctx.auth.user.id;

		const [org] = await db
			.select({ memberRole: organizationMembers.role })
			.from(organizations)
			.innerJoin(
				organizationMembers,
				and(
					eq(organizationMembers.organizationId, organizations.id),
					eq(organizationMembers.userId, currentUserId),
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

		if (org.memberRole !== 'admin') {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'common.access_denied',
			});
		}

		if (currentUserId === input.userId && input.data.role !== undefined) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'members.cannot_change_own_role',
			});
		}

		const [updated] = await db
			.update(organizationMembers)
			.set({
				...input.data,
				updatedAt: sql`now()`,
			})
			.where(
				and(
					eq(organizationMembers.userId, input.userId),
					eq(organizationMembers.organizationId, input.organizationId),
				),
			)
			.returning();

		if (!updated) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'members.not_found',
			});
		}

		return updated;
	});
