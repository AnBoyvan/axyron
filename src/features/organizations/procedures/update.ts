import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { organizationMembers } from '@/db/schema/organization-members';
import { organizations } from '@/db/schema/organizations';
import { protectedProcedure } from '@/trpc/init';

import { updateOrgSchema } from '../schemas/update-org-schema';
import { getOrgPermissions } from '../utils/get-org-permission';

export const update = protectedProcedure
	.input(
		z.object({
			id: z.string(),
			data: updateOrgSchema,
		}),
	)
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [existingMember] = await db
			.select({
				org: organizations,
				member: organizationMembers,
			})
			.from(organizationMembers)
			.innerJoin(
				organizations,
				eq(organizations.id, organizationMembers.organizationId),
			)
			.where(
				and(
					eq(organizationMembers.userId, userId),
					eq(organizationMembers.organizationId, input.id),
				),
			)
			.limit(1);

		if (!existingMember) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'common.access_denied',
			});
		}

		const { org, member } = existingMember;

		const permissions = getOrgPermissions({ org, member });

		if (!permissions.update) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'common.access_denied',
			});
		}

		const [updatedOrg] = await db
			.update(organizations)
			.set({
				...input.data,
			})
			.where(eq(organizations.id, input.id))
			.returning();

		if (!updatedOrg) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'orgs.not_found',
			});
		}

		return {
			id: updatedOrg.id,
			name: updatedOrg.name,
			description: updatedOrg.description,
			image: updatedOrg.image,
			permissions,
		};
	});
