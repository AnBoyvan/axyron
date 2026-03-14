import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { taskPriority } from '@/features/tasks/configs/task-priority-options';
import type { Task } from '@/features/tasks/types';
import { resolveTaskStatus } from '@/features/tasks/utils/resolve-task-status';
import { cn } from '@/lib/utils/cn';

import { TaskStatusSelect } from '../task-status-select';

interface TaskPreviewStatusProps {
	task: Task;
}

export const TaskPreviewStatus = ({ task }: TaskPreviewStatusProps) => {
	const t = useTranslations();

	const resolvedStatus = resolveTaskStatus({
		status: task.status,
		dueDate: task.dueDate,
	});
	const isOverdue = resolvedStatus === 'overdue';
	const priority = taskPriority[task.priority];

	return (
		<div className="flex items-center justify-between gap-4 px-6 py-4">
			<Badge variant="outline" className={cn(priority.badge)}>
				{t(priority.label)}
			</Badge>
			<TaskStatusSelect
				taskId={task.id}
				currentStatus={task.status}
				isOverdue={isOverdue}
				canClose={task.permissions.canCloseTask}
				canEdit={task.permissions.isAssignee || task.permissions.canCloseTask}
			/>
		</div>
	);
};
