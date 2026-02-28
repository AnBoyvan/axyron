import type { TaskSelectSchema } from '@/db/schema/tasks';

import type { Assignee, AssigneeWithCount } from '../types';

export type TasksByPriority = {
	total: number;
	assignees: AssigneeWithCount[];
	notAssigned: number;
	overdue: number;
	pending: number;
	in_progress: number;
	in_review: number;
	completed: number;
	cancelled: number;
};

export const getTasksByPriorityStats = (
	tasks: Array<TaskSelectSchema & { assignees: Assignee[] }>,
): TasksByPriority => {
	const now = new Date();
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
		overdue: tasks.filter(
			t =>
				(t.status === 'in_progress' || t.status === 'pending') &&
				t.dueDate != null &&
				t.dueDate < now,
		).length,
		pending: tasks.filter(
			t => t.status === 'pending' && !(t.dueDate != null && t.dueDate < now),
		).length,
		in_progress: tasks.filter(
			t =>
				t.status === 'in_progress' && !(t.dueDate != null && t.dueDate < now),
		).length,
		in_review: tasks.filter(t => t.status === 'in_review').length,
		completed: tasks.filter(t => t.status === 'completed').length,
		cancelled: tasks.filter(t => t.status === 'cancelled').length,
	};
};
