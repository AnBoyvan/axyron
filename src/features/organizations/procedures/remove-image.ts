import { TRPCError } from '@trpc/server';
import { and, eq, sql } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { organizationMembers } from '@/db/schema/organization-members';
import { organizations } from '@/db/schema/organizations';
import { deleteFile } from '@/lib/r2/delete-file';
import { protectedProcedure } from '@/trpc/init';

import { getOrgPermissions } from '../utils/get-org-permission';

export const removeImage = protectedProcedure
	.input(z.object({ id: z.string() }))
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
				image: null,
				updatedAt: sql`now()`,
			})
			.where(eq(organizations.id, input.id));

		if (row.org.image) {
			await deleteFile(`orgs/${row.org.id}`);
		}

		return {
			id: row.org.id,
			name: row.org.name,
			description: row.org.description,
			image: null,
			permissions,
		};
	});
