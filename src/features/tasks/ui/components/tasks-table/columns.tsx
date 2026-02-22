import type { ColumnDef } from '@tanstack/react-table';

import type { TaskByProject } from '@/features/tasks/types';

export const columns: ColumnDef<TaskByProject>[] = [
	{
		accessorKey: 'status',
		header: 'Status',
	},
	{
		accessorKey: 'title',
		header: 'Title',
	},
	{
		accessorKey: 'priority',
		header: 'Priority',
	},
	{
		accessorKey: 'startDate',
		header: 'Start Date',
	},
	{
		accessorKey: 'dueDate',
		header: 'Due Date',
	},
	{
		accessorKey: 'assignees',
		header: 'Assignees',
	},
];
