import { TextIcon, TriangleAlertIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { taskPriority } from '@/features/tasks/configs/task-priority-options';
import { resolveTaskStatus } from '@/features/tasks/utils/resolve-task-status';
import { authClient } from '@/lib/auth/auth-client';
import { cn } from '@/lib/utils/cn';

import type { TaskById } from '../../../types';
import { TaskAssignees } from './task-assignees';
import { TaskDates } from './task-dates';
import { TaskStatusSelect } from './task-status-select';

interface TaskDetailsProps {
	task: TaskById;
}

export const TaskDetails = ({ task }: TaskDetailsProps) => {
	const t = useTranslations();
	const { data } = authClient.useSession();

	const resolvedStatus = resolveTaskStatus({
		status: task.status,
		dueDate: task.dueDate,
	});

	const isOverdue = resolvedStatus === 'overdue';
	const isAssignee = task.assignees.some(a => a.userId === data?.user.id);
	const isAdmin =
		task.permissions.isProjectAdmin || task.permissions.isOrgAdmin;
	const canCloseTask = isAdmin
		? true
		: task.needReview
			? task.permissions.isProjectAdmin || task.permissions.isOrgAdmin
			: isAssignee;

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
					canClose={canCloseTask}
					canEdit={isAssignee || canCloseTask}
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
				<div className="flex flex-col gap-2">
					<div className="flex gap-2 text-muted-foreground">
						<TextIcon className="size-4" />
						<Label>{t('common.descripton')}</Label>
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
