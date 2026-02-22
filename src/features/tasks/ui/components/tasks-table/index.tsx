import type { TaskByProject } from '@/features/tasks/types';

interface TasksTableProps {
	tasks: TaskByProject[];
}

export const TasksTable = ({ tasks }: TasksTableProps) => {
	return <div>TasksTable</div>;
};
