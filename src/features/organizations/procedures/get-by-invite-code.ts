import { TRPCError } from '@trpc/server';
import { and, eq, getTableColumns } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { organizationMembers } from '@/db/schema/organization-members';
import { organizations } from '@/db/schema/organizations';
import { user } from '@/db/schema/user';
import { protectedProcedure } from '@/trpc/init';

export const getByInviteCode = protectedProcedure
	.input(z.object({ inviteCode: z.string() }))
	.query(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [invitator] = await db
			.select({
				...getTableColumns(organizationMembers),
				name: user.name,
				image: user.image,
			})
			.from(organizationMembers)
			.where(eq(organizationMembers.inviteCode, input.inviteCode))
			.innerJoin(user, eq(user.id, organizationMembers.userId))
			.limit(1);

		if (!invitator) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'orgs.invite_not_found',
			});
		}

		const [organization] = await db
			.select()
			.from(organizations)
			.where(eq(organizations.id, invitator.organizationId))
			.limit(1);

		if (!organization) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'orgs.invite_not_found',
			});
		}

		const [existedMember] = await db
			.select()
			.from(organizationMembers)

			.where(
				and(
					eq(organizationMembers.organizationId, organization.id),
					eq(organizationMembers.userId, userId),
				),
			)
			.limit(1);

		if (existedMember) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'orgs.invite_already_member',
			});
		}

		return {
			organization,
			invitator,
		};
	});
