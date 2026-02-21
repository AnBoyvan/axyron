import { AlertTriangleIcon } from 'lucide-react';
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

import { taskPriorityOptions } from '../../configs/task-priority-options';
import type { TasksFilters } from '../../hooks/use-tasks-filter';

interface TasksPriorityFilterProps {
	value: TasksFilters['priority'];
	onChange: (value: TasksFilters['priority']) => void;
}

export const TasksPriorityFilter = ({
	value,
	onChange,
}: TasksPriorityFilterProps) => {
	const t = useTranslations();

	const onPriorityChange = (option: string) => {
		onChange(option === 'all' ? null : (option as TasksFilters['priority']));
	};

	return (
		<Select defaultValue={value ?? undefined} onValueChange={onPriorityChange}>
			<SelectTrigger className="w-full">
				<div className="flex items-center overflow-hidden pr-2">
					<AlertTriangleIcon className="mr-2 size-4" />
					<SelectValue
						placeholder={t('tasks.priority.all')}
						className="flex gap-2"
					/>
				</div>
			</SelectTrigger>
			<SelectContent align="center" position="popper">
				<SelectItem key="all" value="all">
					{t('tasks.priority.all')}
				</SelectItem>
				<SelectSeparator />
				{taskPriorityOptions.map(option => (
					<SelectItem key={option.value} value={option.value}>
						<div className="flex items-center gap-2">
							<div
								className={cn('size-4 shrink-0 rounded-full', option.cirkle)}
							/>
							{t(option.label as TranslationKey)}
						</div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};
