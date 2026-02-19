import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { organizationMembers } from '@/db/schema/organization-members';
import { protectedProcedure } from '@/trpc/init';

import { buildProjectsQuery } from '../utils/build-projects-query';

export const getByOrganization = protectedProcedure
	.input(z.object({ organizationId: z.string() }))
	.query(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [existingOrgMember] = await db
			.select()
			.from(organizationMembers)
			.where(
				and(
					eq(organizationMembers.userId, userId),
					eq(organizationMembers.organizationId, input.organizationId),
				),
			)
			.limit(1);

		if (!existingOrgMember) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'projects.not_found',
			});
		}

		return buildProjectsQuery({
			organizationId: input.organizationId,
			userId,
			isAdmin: existingOrgMember.role === 'admin',
			archived: false,
		});
	});
