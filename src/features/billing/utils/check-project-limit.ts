import { TRPCError } from '@trpc/server';
import { count, eq } from 'drizzle-orm';

import { db } from '@/db';
import { organizations } from '@/db/schema/organizations';
import { projects } from '@/db/schema/projects';
import { PLANS } from '@/lib/polar/plans';

export const checkProjectLimit = async (organizationId: string) => {
	const [org] = await db
		.select({ plan: organizations.plan })
		.from(organizations)
		.where(eq(organizations.id, organizationId))
		.limit(1);

	if (!org) return;

	const limit = PLANS[org.plan].maxProjects;
	if (limit === Infinity) return;

	const [result] = await db
		.select({ count: count() })
		.from(projects)
		.where(eq(projects.organizationId, organizationId));

	if (result.count >= limit) {
		throw new TRPCError({
			code: 'FORBIDDEN',
			message: 'billing.project_limit_reached',
		});
	}
};
