import { nanoid } from 'nanoid';

import { db } from '@/db';
import { organizationMembers } from '@/db/schema/organization-members';
import { organizations } from '@/db/schema/organizations';
import { protectedProcedure } from '@/trpc/init';

import { createOrgSchema } from '../schemas/create-org-schema';

export const create = protectedProcedure
	.input(createOrgSchema)
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [createdOrg] = await db
			.insert(organizations)
			.values({
				name: input.name,
				description: input.description,
			})
			.returning();

		await db.insert(organizationMembers).values({
			userId,
			organizationId: createdOrg.id,
			role: 'admin',
			inviteCode: nanoid(),
			invitedBy: userId,
			canInvite: true,
			canRemoveMember: true,
			canUpdate: false,
			canCreateProject: true,
			canCreateMeeting: true,
		});

		return createdOrg;
	});
