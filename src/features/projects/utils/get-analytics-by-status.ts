import type { TaskSelectSchema } from '@/db/schema/tasks';
import type { Assignee } from '@/features/tasks/types';
import {
	getTasksByStatus,
	type TasksByStatus,
} from '@/features/tasks/utils/get-tasks-by-status';

export type AnalyticsByStatus = {
	total: number;
	overdue: TasksByStatus;
	pending: TasksByStatus;
	in_progress: TasksByStatus;
	in_review: TasksByStatus;
	completed: TasksByStatus;
	cancelled: TasksByStatus;
};

interface GetAnalyticsByStatusProps {
	tasks: TaskSelectSchema[];
	assignees: Assignee[];
}

export const getAnalyticsByStatus = ({
	tasks,
	assignees,
}: GetAnalyticsByStatusProps): AnalyticsByStatus => {
	const tasksWithAssignees = tasks.map(task => ({
		...task,
		assignees: assignees.filter(a => a.taskId === task.id),
	}));

	const now = new Date();

	const overdueTasks = tasksWithAssignees.filter(
		t =>
			(t.status === 'in_progress' || t.status === 'pending') &&
			t.dueDate != null &&
			t.dueDate < now,
	);

	const pendingTasks = tasksWithAssignees.filter(
		t => t.status === 'pending' && !(t.dueDate != null && t.dueDate < now),
	);

	const inProgressTasks = tasksWithAssignees.filter(
		t => t.status === 'in_progress' && !(t.dueDate != null && t.dueDate < now),
	);

	const inReviewTasks = tasksWithAssignees.filter(
		t => t.status === 'in_review',
	);

	const completedTasks = tasksWithAssignees.filter(
		t => t.status === 'completed',
	);

	const cancelledTasks = tasksWithAssignees.filter(
		t => t.status === 'cancelled',
	);

	return {
		total: tasks.length,
		overdue: getTasksByStatus(overdueTasks),
		pending: getTasksByStatus(pendingTasks),
		in_progress: getTasksByStatus(inProgressTasks),
		in_review: getTasksByStatus(inReviewTasks),
		completed: getTasksByStatus(completedTasks),
		cancelled: getTasksByStatus(cancelledTasks),
	};
};
