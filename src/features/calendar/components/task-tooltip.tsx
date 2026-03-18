import { useTranslations } from 'next-intl';

import { taskPriority } from '@/features/tasks/configs/task-priority-options';
import { taskStatuses } from '@/features/tasks/configs/task-status-options';
import type { Task } from '@/features/tasks/types';
import { resolveTaskStatus } from '@/features/tasks/utils/resolve-task-status';
import { UserAvatar } from '@/features/users/ui/components/user-avatar';

interface TaskTooltipProps {
	task: Task;
}

export const TaskTooltip = ({ task }: TaskTooltipProps) => {
	const t = useTranslations();

	const resolvedStatus = resolveTaskStatus({
		status: task.status,
		dueDate: task.dueDate,
	});

	const status = taskStatuses[resolvedStatus];
	const priority = taskPriority[task.priority];

	return (
		<div className="flex flex-col gap-2">
			<p className="font-medium">{task.title}</p>
			<div className="flex items-center gap-2">
				<span
					className="rounded-full px-1.5 py-0.5 font-medium text-white text-xs"
					style={{ backgroundColor: priority.oklch }}
				>
					{t(priority.label)}
				</span>
				<span
					className="rounded-full px-1.5 py-0.5 font-medium text-white text-xs"
					style={{ backgroundColor: status.oklch }}
				>
					{t(status.label)}
				</span>
			</div>
			{task.assignees.length > 0 && (
				<div className="flex items-center gap-1">
					{task.assignees.slice(0, 4).map(assignee => (
						<UserAvatar
							size="xs"
							key={assignee.userId}
							name={assignee.name}
							imageUrl={assignee.image}
							className="ring-1 ring-background"
						/>
					))}
					{task.assignees.length > 4 && (
						<span className="text-muted-foreground text-xs">
							+{task.assignees.length - 4}
						</span>
					)}
				</div>
			)}
		</div>
	);
};
