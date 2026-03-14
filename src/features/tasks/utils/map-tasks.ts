import type { getProjectAccess } from '@/features/projects/utils/get-project-access';

import type { TaskRow } from '../types';

type ProjectAccess = Awaited<ReturnType<typeof getProjectAccess>>;

export const mapTask = (
	row: TaskRow,
	permissions: ProjectAccess,
	currentUserId: string,
) => {
	const isAssignee = row.assignees.some(a => a.userId === currentUserId);
	const isAdmin = permissions.isProjectAdmin || permissions.isOrgAdmin;
	const canCloseTask = isAdmin ? true : row.needReview ? isAdmin : isAssignee;

	return {
		...row,
		link: `/org/${row.organizationId}/projects/${row.projectId}/tasks/${row.id}`,
		permissions: {
			...permissions,
			isAssignee,
			canCloseTask,
		},
	};
};
