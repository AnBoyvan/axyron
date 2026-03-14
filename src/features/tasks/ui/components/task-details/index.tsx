import { TextIcon, TriangleAlertIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { taskPriority } from '@/features/tasks/configs/task-priority-options';
import { resolveTaskStatus } from '@/features/tasks/utils/resolve-task-status';
import { cn } from '@/lib/utils/cn';

import type { Task } from '../../../types';
import { TaskStatusSelect } from '../task-status-select';
import { TaskAssignees, TaskAssigneesSkeleton } from './task-assignees';
import { TaskDates, TaskDatesSkeleton } from './task-dates';

interface TaskDetailsProps {
	task: Task;
}

export const TaskDetails = ({ task }: TaskDetailsProps) => {
	const t = useTranslations();

	const resolvedStatus = resolveTaskStatus({
		status: task.status,
		dueDate: task.dueDate,
	});

	const isOverdue = resolvedStatus === 'overdue';

	return (
		<div className="flex flex-col gap-4 px-4 pt-4 lg:px-8 lg:pt-8">
			<div className="flex items-center justify-between gap-4">
				<Badge
					variant="outline"
					className={cn(taskPriority[task.priority].badge)}
				>
					{t(taskPriority[task.priority].label)}
				</Badge>
				<TaskStatusSelect
					taskId={task.id}
					currentStatus={task.status}
					isOverdue={isOverdue}
					canClose={task.permissions.canCloseTask}
					canEdit={task.permissions.isAssignee || task.permissions.canCloseTask}
				/>
			</div>
			<div className="flex flex-col gap-4 lg:gap-8">
				<h1 className="text-xl">{task.title}</h1>
				{isOverdue && (
					<div className="flex items-center gap-2">
						<TriangleAlertIcon className="size-4 stroke-3 text-destructive" />
						<p className="font-bold text-destructive text-lg">
							{t('tasks.overdue_alert')}
						</p>
					</div>
				)}
				{(task.startDate || task.dueDate) && (
					<TaskDates
						startDate={task.startDate}
						dueDate={task.dueDate}
						isOverdue={isOverdue}
					/>
				)}
				<div className="flex flex-col">
					<div className="flex h-8 items-center gap-2 text-muted-foreground">
						<TextIcon className="size-4" />
						<h2 className="font-semibold text-base">
							{t('common.description')}
						</h2>
					</div>
					{task.description ? (
						<p>{task.description}</p>
					) : (
						<p className="text-muted-foreground italic">
							{t('tasks.description_empty')}
						</p>
					)}
				</div>
				<TaskAssignees
					assignees={task.assignees}
					taskId={task.id}
					projectId={task.projectId}
					canUpdate={task.permissions.canCreateTask}
				/>
			</div>
		</div>
	);
};

export const TaskDetailsSkeleton = () => {
	return (
		<div className="flex flex-col gap-4 px-4 pt-4 lg:px-8 lg:pt-8">
			<div className="flex items-center justify-between gap-4">
				<Skeleton className="h-5 w-20 rounded-full" />
				<Skeleton className="h-9 w-36" />
			</div>
			<div className="flex flex-col gap-4 lg:gap-8">
				<Skeleton className="h-7 w-3/4" />
				<TaskDatesSkeleton />
				<div className="flex flex-col gap-1">
					<div className="flex h-8 items-center">
						<Skeleton className="h-4 w-24" />
					</div>
					<div className="space-y-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-5/6" />
					</div>
				</div>
				<TaskAssigneesSkeleton />
			</div>
		</div>
	);
};
