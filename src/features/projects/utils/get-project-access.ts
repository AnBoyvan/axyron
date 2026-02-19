import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';

import { db } from '@/db';
import { organizationMembers } from '@/db/schema/organization-members';
import { projectMembers } from '@/db/schema/project-members';
import { projects } from '@/db/schema/projects';

type GetProjectAccessProps = {
	userId: string;
	projectId: string;
};

type ProjectAccess = {
	isMember: boolean;
	isProjectAdmin: boolean;
	isOrgAdmin: boolean;
	canInvite: boolean;
	canCreateTask: boolean;
	project: {
		id: string;
		name: string;
		description: string | null;
		visibility: 'private' | 'public';
		organizationId: string;
		archived: boolean;
		status: 'pending' | 'active' | 'closed';
	};
};

export const getProjectAccess = async ({
	projectId,
	userId,
}: GetProjectAccessProps): Promise<ProjectAccess> => {
	const [row] = await db
		.select({
			project: {
				id: projects.id,
				name: projects.name,
				description: projects.description,
				visibility: projects.visibility,
				organizationId: projects.organizationId,
				archived: projects.archived,
				status: projects.status,
			},
			orgMemberRole: organizationMembers.role,
			projectMemberRole: projectMembers.role,
			projectMemberCanInvite: projectMembers.canInvite,
			projectMemberCanCreateTask: projectMembers.canCreateTask,
		})
		.from(projects)
		.leftJoin(
			organizationMembers,
			and(
				eq(organizationMembers.organizationId, projects.organizationId),
				eq(organizationMembers.userId, userId),
			),
		)
		.leftJoin(
			projectMembers,
			and(
				eq(projectMembers.projectId, projects.id),
				eq(projectMembers.userId, userId),
			),
		)
		.where(eq(projects.id, projectId))
		.limit(1);

	if (!row) {
		throw new TRPCError({
			code: 'NOT_FOUND',
			message: 'projects.not_found',
		});
	}

	if (!row.orgMemberRole) {
		throw new TRPCError({
			code: 'FORBIDDEN',
			message: 'projects.not_found',
		});
	}

	const isMember = Boolean(row.projectMemberRole);
	const isProjectAdmin = row.projectMemberRole === 'admin';
	const isOrgAdmin = row.orgMemberRole === 'admin';

	if (row.project.visibility === 'private' && !isMember && !isOrgAdmin) {
		throw new TRPCError({
			code: 'FORBIDDEN',
			message: 'projects.not_found',
		});
	}

	return {
		project: row.project,
		isMember,
		isProjectAdmin,
		isOrgAdmin,
		canInvite:
			isOrgAdmin || isProjectAdmin || Boolean(row.projectMemberCanInvite),
		canCreateTask:
			isOrgAdmin || isProjectAdmin || Boolean(row.projectMemberCanCreateTask),
	};
};
