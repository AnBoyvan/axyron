import type { TaskSelectSchema } from '@/db/schema/tasks';
import type { Assignee } from '@/features/tasks/types';
import {
	getTasksByPriorityStats,
	type TasksByPriority,
} from '@/features/tasks/utils/get-tasks-by-priority';

export type AnalyticsByPriority = {
	total: number;
	critical: TasksByPriority;
	high: TasksByPriority;
	medium: TasksByPriority;
	low: TasksByPriority;
};

interface GetAnalyticsByPriorityProps {
	tasks: TaskSelectSchema[];
	assignees: Assignee[];
}

export const getAnalyticsByPriority = ({
	tasks,
	assignees,
}: GetAnalyticsByPriorityProps): AnalyticsByPriority => {
	const tasksWithAssignees = tasks.map(task => ({
		...task,
		assignees: assignees.filter(a => a.taskId === task.id),
	}));

	return {
		total: tasks.length,
		critical: getTasksByPriorityStats(
			tasksWithAssignees.filter(t => t.priority === 'critical'),
		),
		high: getTasksByPriorityStats(
			tasksWithAssignees.filter(t => t.priority === 'high'),
		),
		medium: getTasksByPriorityStats(
			tasksWithAssignees.filter(t => t.priority === 'medium'),
		),
		low: getTasksByPriorityStats(
			tasksWithAssignees.filter(t => t.priority === 'low'),
		),
	};
};
