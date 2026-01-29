import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';

import { db } from '@/db';
import { organizationMembers } from '@/db/schema/organization-members';
import { projectMembers } from '@/db/schema/project-members';

type GetProjectAccessProps = {
	userId: string;
	projectId: string;
	visibility: 'private' | 'public';
	orgId: string;
};

type ProjectAccess = {
	isMember: boolean;
	isProjectAdmin: boolean;
	isOrgAdmin: boolean;
	canInvite: boolean;
	canCreateTask: boolean;
};

export const getProjectAccess = async ({
	orgId,
	projectId,
	visibility,
	userId,
}: GetProjectAccessProps): Promise<ProjectAccess> => {
	const [existingOrgMember] = await db
		.select()
		.from(organizationMembers)
		.where(
			and(
				eq(organizationMembers.userId, userId),
				eq(organizationMembers.organizationId, orgId),
			),
		)
		.limit(1);

	if (!existingOrgMember) {
		throw new TRPCError({
			code: 'FORBIDDEN',
			message: 'projects.not_found',
		});
	}

	const [existingProjectMember] = await db
		.select()
		.from(projectMembers)
		.where(
			and(
				eq(projectMembers.userId, userId),
				eq(projectMembers.projectId, projectId),
			),
		)
		.limit(1);

	const isMember = Boolean(existingProjectMember);
	const isProjectAdmin = Boolean(existingProjectMember?.role === 'admin');
	const isOrgAdmin = existingOrgMember.role === 'admin';

	if (visibility === 'private' && !isMember && !isOrgAdmin) {
		throw new TRPCError({
			code: 'FORBIDDEN',
			message: 'projects.not_found',
		});
	}

	return {
		isProjectAdmin,
		isOrgAdmin,
		isMember,
		canCreateTask:
			isOrgAdmin ||
			isProjectAdmin ||
			Boolean(existingProjectMember?.canCreateTask),
		canInvite:
			isOrgAdmin || isProjectAdmin || Boolean(existingProjectMember?.canInvite),
	};
};
