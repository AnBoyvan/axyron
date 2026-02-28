import type { TaskSelectSchema } from '@/db/schema/tasks';

export type Stats = {
	total: number;
	byStatus: {
		overdue: number;
		pending: number;
		in_progress: number;
		in_review: number;
		completed: number;
		cancelled: number;
	};
	byPriority: {
		critical: number;
		high: number;
		medium: number;
		low: number;
	};
};

export const getStats = (tasks: TaskSelectSchema[]): Stats => {
	const now = new Date();

	return {
		total: tasks.length,
		byStatus: {
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
		},
		byPriority: {
			critical: tasks.filter(t => t.priority === 'critical').length,
			high: tasks.filter(t => t.priority === 'high').length,
			medium: tasks.filter(t => t.priority === 'medium').length,
			low: tasks.filter(t => t.priority === 'low').length,
		},
	};
};
