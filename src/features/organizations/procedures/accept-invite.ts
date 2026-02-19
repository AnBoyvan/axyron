import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import z from 'zod';

import { db } from '@/db';
import { organizationMembers } from '@/db/schema/organization-members';
import { organizations } from '@/db/schema/organizations';
import { protectedProcedure } from '@/trpc/init';

export const acceptInvite = protectedProcedure
	.input(z.object({ inviteCode: z.string() }))
	.mutation(async ({ ctx, input }) => {
		const currentUserId = ctx.auth.user.id;

		const [existedInvite] = await db
			.select({
				organizationId: organizationMembers.organizationId,
				invitedBy: organizationMembers.userId,
				inviterRole: organizationMembers.role,
				inviterCanInvite: organizationMembers.canInvite,
				orgCanInvite: organizations.canInvite,
			})
			.from(organizationMembers)
			.innerJoin(
				organizations,
				eq(organizations.id, organizationMembers.organizationId),
			)
			.where(eq(organizationMembers.inviteCode, input.inviteCode))
			.limit(1);

		if (!existedInvite) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'orgs.invite_not_found',
			});
		}

		const inviterIsAdmin = existedInvite.inviterRole === 'admin';
		const canInvite =
			inviterIsAdmin ||
			existedInvite.orgCanInvite ||
			existedInvite.inviterCanInvite;

		if (!canInvite) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'orgs.invite_not_found',
			});
		}

		const [newMember] = await db
			.insert(organizationMembers)
			.values({
				userId: currentUserId,
				organizationId: existedInvite.organizationId,
				role: 'member',
				inviteCode: nanoid(),
				invitedBy: existedInvite.invitedBy,
			})
			.onConflictDoNothing()
			.returning();

		if (!newMember) {
			throw new TRPCError({
				code: 'CONFLICT',
				message: 'members.already_exists',
			});
		}

		return { organizationId: existedInvite.organizationId };
	});
