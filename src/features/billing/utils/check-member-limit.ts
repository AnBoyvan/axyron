import { count, eq } from 'drizzle-orm';

import { db } from '@/db';
import { organizations } from '@/db/schema/organizations';
import { PLANS } from '@/lib/polar/plans';
import { organizationMembers } from '@/db/schema/organization-members';
import { TRPCError } from '@trpc/server';

export const checkMemberLimit = async (organizationId: string) => {
	const [org] = await db
		.select({ plan: organizations.plan })
		.from(organizations)
		.where(eq(organizations.id, organizationId))
		.limit(1);

	if (!org) return;

	const limit = PLANS[org.plan].maxMembers;
	if (limit === Infinity) return;

	const [result] = await db
		.select({ count: count() })
		.from(organizationMembers)
		.where(eq(organizationMembers.organizationId, organizationId));

	if (result.count >= limit) {
		throw new TRPCError({
			code: 'FORBIDDEN',
			message: 'billing.member_limit_reached',
		});
	}
};
