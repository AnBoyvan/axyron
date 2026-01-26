import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { organizationMembers } from '@/db/schema/organization-members';
import { organizations } from '@/db/schema/organizations';
import { protectedProcedure } from '@/trpc/init';

import { getOrgPermissions } from '../utils/get-org-permission';

export const getById = protectedProcedure
	.input(z.object({ id: z.string() }))
	.query(async ({ ctx, input }) => {
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

		if (!existingMember) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'common.access_denied',
			});
		}

		const [existingOrg] = await db
			.select()
			.from(organizations)
			.where(eq(organizations.id, input.id))
			.limit(1);

		if (!existingOrg) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'orgs.not_found',
			});
		}

		const permissions = getOrgPermissions({
			org: existingOrg,
			member: existingMember,
		});

		return {
			id: existingOrg.id,
			name: existingOrg.name,
			description: existingOrg.description,
			image: existingOrg.image,
			permissions,
		};
	});
