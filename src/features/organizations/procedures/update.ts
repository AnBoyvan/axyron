import { TRPCError } from '@trpc/server';
import { and, eq, sql } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { organizationMembers } from '@/db/schema/organization-members';
import { organizations } from '@/db/schema/organizations';
import { protectedProcedure } from '@/trpc/init';

import { updateOrgSchema } from '../schemas/update-org-schema';
import { getOrgPermissions } from '../utils/get-org-permission';

export const update = protectedProcedure
	.input(z.object({ id: z.string(), data: updateOrgSchema }))
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [row] = await db
			.select({
				org: organizations,
				member: organizationMembers,
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

		const permissions = getOrgPermissions({
			org: row.org,
			member: row.member,
		});

		if (!permissions.update) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'common.access_denied',
			});
		}

		await db
			.update(organizations)
			.set({
				...input.data,
				updatedAt: sql`now()`,
			})
			.where(eq(organizations.id, input.id));

		return {
			id: row.org.id,
			name: input.data.name ?? row.org.name,
			description: input.data.description ?? row.org.description,
			image: row.org.image,
			permissions,
		};
	});
