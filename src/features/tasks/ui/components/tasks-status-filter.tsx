import { ListChecksIcon } from 'lucide-react';
import { type TranslationKey, useTranslations } from 'next-intl';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils/cn';

import { taskStatusOptions } from '../../configs/task-status-options';
import type { TasksFilters } from '../../hooks/use-tasks-filter';
import type { TaskStatusEnum } from '../../types';

interface TasksStatusFilterProps {
	value: TasksFilters['status'];
	onChange: (value: TasksFilters['status']) => void;
}

export const TasksStatusFilter = ({
	value,
	onChange,
}: TasksStatusFilterProps) => {
	const t = useTranslations();

	const onStatusChange = (option: string) => {
		onChange(option === 'all' ? null : (option as TaskStatusEnum));
	};

	return (
		<Select defaultValue={value ?? undefined} onValueChange={onStatusChange}>
			<SelectTrigger className="w-full">
				<div className="flex items-center overflow-hidden pr-2">
					<ListChecksIcon className="mr-2 size-4" />
					<SelectValue
						placeholder={t('tasks.statuses.all')}
						className="flex gap-2"
					/>
				</div>
			</SelectTrigger>
			<SelectContent align="center" position="popper">
				<SelectItem key="all" value="all">
					{t('tasks.statuses.all')}
				</SelectItem>
				<SelectSeparator />
				{taskStatusOptions.map(option => (
					<SelectItem key={option.value} value={option.value}>
						<div className="flex items-center gap-2">
							<option.icon className={cn(option.iconStyle)} />
							{t(option.label as TranslationKey)}
						</div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};
