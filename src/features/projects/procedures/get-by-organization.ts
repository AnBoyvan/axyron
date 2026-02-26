import { TRPCError } from '@trpc/server';
import { and, eq, getTableColumns } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { organizationMembers } from '@/db/schema/organization-members';
import { organizations } from '@/db/schema/organizations';
import { getOrgPermissions } from '@/features/organizations/utils/get-org-permission';
import { protectedProcedure } from '@/trpc/init';

import { buildProjectsQuery } from '../utils/build-projects-query';

export const getByOrganization = protectedProcedure
	.input(z.object({ organizationId: z.string() }))
	.query(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [data] = await db
			.select({
				member: {
					...getTableColumns(organizationMembers),
				},
				organization: {
					...getTableColumns(organizations),
				},
			})
			.from(organizationMembers)
			.innerJoin(
				organizations,
				eq(organizations.id, organizationMembers.organizationId),
			)
			.where(
				and(
					eq(organizationMembers.userId, userId),
					eq(organizationMembers.organizationId, input.organizationId),
				),
			)
			.limit(1);

		if (!data) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'projects.not_found',
			});
		}
		const permissions = getOrgPermissions({
			org: data.organization,
			member: data.member,
		});

		const projects = await buildProjectsQuery({
			organizationId: input.organizationId,
			userId,
			isAdmin: data.member.role === 'admin',
			archived: false,
		});

		return {
			organization: data.organization,
			permissions,
			projects,
		};
	});
