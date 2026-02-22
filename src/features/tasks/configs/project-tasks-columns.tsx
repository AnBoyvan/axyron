import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import type { Locale, Translator } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import type { TaskByProject } from '@/features/tasks/types';
import { UserAvatar } from '@/features/users/ui/components/user-avatar';
import { fnsLocale } from '@/i18n/config';
import { cn } from '@/lib/utils/cn';

import { taskPriority } from './task-priority-options';
import { taskStatuses } from './task-status-options';

export const projectTasksColumns = (
	t: Translator,
	locale: Locale,
): ColumnDef<TaskByProject>[] => [
	{
		accessorKey: 'status',
		header: '',
		cell: ({ row }) => {
			const status = taskStatuses[row.original.status];
			return (
				<div className="flex justify-center">
					<Tooltip>
						<TooltipTrigger>
							<status.icon className={cn('size-4', status.iconStyle)} />
						</TooltipTrigger>
						<TooltipContent>
							<p>{t(status.label)}</p>
						</TooltipContent>
					</Tooltip>
				</div>
			);
		},
	},
	{
		accessorKey: 'title',
		header: t('tasks.title_title'),
		cell: ({ row }) => {
			return (
				<div className="lg: w-52 truncate md:w-full lg:min-w-72">
					{row.original.title}
				</div>
			);
		},
	},
	{
		accessorKey: 'priority',
		header: t('common.priority'),
		cell: ({ row }) => {
			const priority = taskPriority[row.original.priority];
			return (
				<Badge variant="outline" className={cn(priority.badge)}>
					{t(priority.label)}
				</Badge>
			);
		},
	},
	{
		accessorKey: 'startDate',
		header: t('common.start_date'),
		cell: ({ row }) => {
			const startDate = row.original.startDate;
			if (!startDate) return null;
			return (
				<div className={cn('text-sm')}>
					{format(startDate, 'dd-MM-yyy', {
						locale: fnsLocale[locale],
					})}
				</div>
			);
		},
	},
	{
		accessorKey: 'dueDate',
		header: t('common.due_date'),
		cell: ({ row }) => {
			const startDate = row.original.dueDate;
			const isOverdue = row.original.status === 'overdue';
			if (!startDate) return null;
			return (
				<div
					className={cn(
						'text-sm',
						isOverdue && taskStatuses[row.original.status].iconStyle,
					)}
				>
					{format(startDate, 'dd-MM-yyy', {
						locale: fnsLocale[locale],
					})}
				</div>
			);
		},
	},
	{
		accessorKey: 'assignees',
		header: t('common.assignees'),
		cell: ({ row }) => {
			const assignees = row.original.assignees;
			return (
				<div className="flex gap-1">
					{assignees.map(user => (
						<Tooltip key={user.userId}>
							<TooltipTrigger>
								<UserAvatar size="sm" imageUrl={user.image} name={user.name} />
							</TooltipTrigger>
							<TooltipContent>
								<p>{user.name}</p>
							</TooltipContent>
						</Tooltip>
					))}
				</div>
			);
		},
	},
];
