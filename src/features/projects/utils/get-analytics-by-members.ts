import type { TaskSelectSchema } from '@/db/schema/tasks';
import type { Assignee } from '@/features/tasks/types';
import { getStats, type Stats } from '@/features/tasks/utils/get-stats';

import type { ProjectMember } from '../types';

type MemberWithStats = ProjectMember & Stats;

export type AnalyticsByMembers = {
	total: number;
	members: MemberWithStats[];
	notAssigned: Stats;
};

interface GetAnalyticsByMembersProps {
	tasks: TaskSelectSchema[];
	assignees: Assignee[];
	members: ProjectMember[];
}

export const getAnalyticsByMembers = ({
	tasks,
	assignees,
	members,
}: GetAnalyticsByMembersProps): AnalyticsByMembers => {
	const memberStats: MemberWithStats[] = members.map(member => {
		const memberTasks = tasks.filter(task =>
			assignees.some(a => a.taskId === task.id && a.userId === member.userId),
		);

		return {
			...member,
			...getStats(memberTasks),
		};
	});

	const notAssignedTasks = tasks.filter(
		task => !assignees.some(a => a.taskId === task.id),
	);

	return {
		total: tasks.length,
		members: memberStats,
		notAssigned: getStats(notAssignedTasks),
	};
};
