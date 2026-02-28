import type { TaskSelectSchema } from '@/db/schema/tasks';

import type { Assignee, AssigneeWithCount } from '../types';

export type TasksByStatus = {
	total: number;
	assignees: AssigneeWithCount[];
	notAssigned: number;
	critical: number;
	high: number;
	medium: number;
	low: number;
};

export const getTasksByStatus = (
	tasks: Array<TaskSelectSchema & { assignees: Assignee[] }>,
): TasksByStatus => {
	const assigneeMap = new Map<string, AssigneeWithCount>();

	for (const task of tasks) {
		for (const assignee of task.assignees) {
			const existing = assigneeMap.get(assignee.userId);
			if (existing) {
				existing.count++;
			} else {
				assigneeMap.set(assignee.userId, { ...assignee, count: 1 });
			}
		}
	}

	return {
		total: tasks.length,
		assignees: Array.from(assigneeMap.values()),
		notAssigned: tasks.filter(t => t.assignees.length === 0).length,
		critical: tasks.filter(t => t.priority === 'critical').length,
		high: tasks.filter(t => t.priority === 'high').length,
		medium: tasks.filter(t => t.priority === 'medium').length,
		low: tasks.filter(t => t.priority === 'low').length,
	};
};
