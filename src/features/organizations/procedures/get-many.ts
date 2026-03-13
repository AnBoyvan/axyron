import { asc, eq } from 'drizzle-orm';

import { db } from '@/db';
import { organizationMembers } from '@/db/schema/organization-members';
import { organizations } from '@/db/schema/organizations';
import { protectedProcedure } from '@/trpc/init';

import { getOrgPermissions } from '../utils/get-org-permission';

export const getMany = protectedProcedure.query(async ({ ctx }) => {
	const userId = ctx.auth.user.id;

	const data = await db
		.select({
			org: organizations,
			member: organizationMembers,
		})
		.from(organizationMembers)
		.innerJoin(
			organizations,
			eq(organizations.id, organizationMembers.organizationId),
		)
		.where(eq(organizationMembers.userId, userId))
		.orderBy(asc(organizationMembers.createdAt));

	const orgs = data.map(item => {
		const { org, member } = item;

		const permissions = getOrgPermissions({ org, member });

		return {
			id: org.id,
			name: org.name,
			description: org.description,
			image: org.image,
			permissions,
			member,
		};
	});

	return orgs;
});
