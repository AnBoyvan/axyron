import { TRPCError } from '@trpc/server';
import { and, asc, eq, getTableColumns } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { organizationMembers } from '@/db/schema/organization-members';
import { organizations } from '@/db/schema/organizations';
import { user } from '@/db/schema/user';
import { protectedProcedure } from '@/trpc/init';

export const getMembers = protectedProcedure
	.input(z.object({ organizationId: z.string() }))
	.query(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [org] = await db
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

		if (!org) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'orgs.not_found',
			});
		}

		const members = await db
			.select({
				...getTableColumns(organizationMembers),
				name: user.name,
				email: user.email,
				image: user.image,
				phone: user.phone,
				position: user.position,
			})
			.from(organizationMembers)
			.innerJoin(user, eq(user.id, organizationMembers.userId))
			.where(eq(organizationMembers.organizationId, input.organizationId))
			.orderBy(asc(user.name), asc(organizationMembers.createdAt));

		return members;
	});
