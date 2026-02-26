import { TRPCError } from '@trpc/server';
import { and, eq, not, sql } from 'drizzle-orm';

import { db } from '@/db';
import { projectMembers } from '@/db/schema/project-members';

interface IsLastProjectAdminProps {
	userId: string;
	projectId: string;
}

export const isLastProjectAdmin = async ({
	userId,
	projectId,
}: IsLastProjectAdminProps) => {
	const [member] = await db
		.select({
			role: projectMembers.role,
		})
		.from(projectMembers)
		.where(
			and(
				eq(projectMembers.userId, userId),
				eq(projectMembers.projectId, projectId),
			),
		)
		.limit(1);

	if (!member) {
		throw new TRPCError({
			code: 'NOT_FOUND',
			message: 'members.not_found',
		});
	}

	if (member.role !== 'admin') {
		return;
	}

	const [{ count }] = await db
		.select({
			count: sql<number>`count(*)::int`,
		})
		.from(projectMembers)
		.where(
			and(
				eq(projectMembers.projectId, projectId),
				eq(projectMembers.role, 'admin'),
				not(eq(projectMembers.userId, userId)),
			),
		);

	if (count < 1) {
		throw new TRPCError({
			code: 'BAD_REQUEST',
			message: 'members.last_admin_protected',
		});
	}

	return;
};
