import { TRPCError } from '@trpc/server';
import { and, eq, getTableColumns } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { organizationMembers } from '@/db/schema/organization-members';
import { organizations } from '@/db/schema/organizations';
import { user } from '@/db/schema/user';
import { protectedProcedure } from '@/trpc/init';

import { getOrgPermissions } from '../utils/get-org-permission';

export const removeMember = protectedProcedure
	.input(z.object({ organizationId: z.string(), userId: z.string() }))
	.mutation(async ({ ctx, input }) => {
		const currentUserId = ctx.auth.user.id;

		if (currentUserId === input.userId) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'members.cannot_remove_self',
			});
		}

		const [org] = await db
			.select({
				org: getTableColumns(organizations),
				member: getTableColumns(organizationMembers),
				targetName: user.name,
				targetEmail: user.email,
				targetImage: user.image,
			})
			.from(organizations)
			.innerJoin(
				organizationMembers,
				and(
					eq(organizationMembers.organizationId, organizations.id),
					eq(organizationMembers.userId, currentUserId),
				),
			)
			.innerJoin(user, and(eq(user.id, input.userId)))
			.where(eq(organizations.id, input.organizationId))
			.limit(1);

		if (!org) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'orgs.not_found',
			});
		}

		const permissions = getOrgPermissions({
			org: org.org,
			member: org.member,
		});

		if (!permissions.removeMember) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'common.access_denied',
			});
		}

		const [removedMember] = await db
			.delete(organizationMembers)
			.where(
				and(
					eq(organizationMembers.userId, input.userId),
					eq(organizationMembers.organizationId, input.organizationId),
				),
			)
			.returning({ userId: organizationMembers.userId });

		if (!removedMember) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'members.not_found',
			});
		}

		return {
			userId: removedMember.userId,
			name: org.targetName,
			email: org.targetEmail,
			image: org.targetImage,
		};
	});
