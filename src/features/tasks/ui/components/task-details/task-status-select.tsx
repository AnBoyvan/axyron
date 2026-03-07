import { useTranslations } from 'next-intl';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	dbTaskStatuses,
	taskStatuses,
} from '@/features/tasks/configs/task-status-options';
import { useUpdateTask } from '@/features/tasks/hooks/use-update-task';
import type { TaskById } from '@/features/tasks/types';
import { cn } from '@/lib/utils/cn';

interface TaskStatusSelectProps {
	taskId: string;
	currentStatus: TaskById['status'];
	isOverdue?: boolean;
	canClose?: boolean;
	canEdit?: boolean;
}

export const TaskStatusSelect = ({
	taskId,
	currentStatus,
	isOverdue,
	canClose,
	canEdit,
}: TaskStatusSelectProps) => {
	const t = useTranslations();

	const updateTask = useUpdateTask();

	const onStatusSelect = (status: TaskById['status']) => {
		updateTask.mutate({
			taskId,
			data: {
				status,
			},
		});
	};

	const resolvedStatus = taskStatuses[currentStatus];

	return (
		<Select
			value={currentStatus}
			disabled={!canEdit}
			onValueChange={value => onStatusSelect(value as TaskById['status'])}
		>
			<SelectTrigger className={cn(isOverdue && 'border-destructive')}>
				<SelectValue>
					<div className="flex items-center gap-2">
						<resolvedStatus.icon className={cn(resolvedStatus.iconStyle)} />
						{t(resolvedStatus.label)}
					</div>
				</SelectValue>
			</SelectTrigger>
			<SelectContent align="center" position="popper">
				{dbTaskStatuses.map(status => (
					<SelectItem
						key={status.value}
						value={status.value}
						disabled={
							(status.value === 'completed' || status.value === 'cancelled') &&
							!canClose
						}
					>
						<div className="flex items-center gap-2">
							<status.icon className={cn(status.iconStyle)} />
							{t(status.label)}
						</div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};
