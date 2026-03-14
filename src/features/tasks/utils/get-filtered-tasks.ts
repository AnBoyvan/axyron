import type { TasksFilters } from '../hooks/use-tasks-filter';
import type { Task } from '../types';

interface GetFilteredTasksProps {
	tasks: Task[];
	filters: TasksFilters;
}

export const getFilteredTasks = ({ tasks, filters }: GetFilteredTasksProps) => {
	const { search, status, priority, dueDateTo, assignee } = filters;

	let filtered = tasks;

	if (search) {
		filtered = filtered.filter(task =>
			task.title.toLowerCase().includes(search.toLowerCase()),
		);
	}

	if (status) {
		filtered = filtered.filter(task => task.status === status);
	}

	if (priority) {
		filtered = filtered.filter(task => task.priority === priority);
	}

	if (dueDateTo) {
		filtered = filtered.filter(
			task => task.dueDate && task.dueDate <= dueDateTo,
		);
	}

	if (assignee) {
		filtered = filtered.filter(task =>
			task.assignees.map(item => item.userId).includes(assignee),
		);
	}

	return filtered;
};
