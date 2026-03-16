import { useTranslations } from 'next-intl';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import type { TasksFilters } from '../../hooks/use-tasks-filter';

interface TasksVariantFilterProps {
	value: TasksFilters['variant'];
	onChange: (value: TasksFilters['variant']) => void;
}

export const TasksVariantFilter = ({
	value,
	onChange,
}: TasksVariantFilterProps) => {
	const t = useTranslations();

	const onVariantChange = (option: string) => {
		onChange(option);
	};

	return (
		<Select defaultValue={value ?? 'assigned'} onValueChange={onVariantChange}>
			<SelectTrigger className="w-full overflow-hidden md:w-fit">
				<div className="flex flex-1 items-center overflow-hidden pr-2">
					<SelectValue className="line-clamp-1 flex gap-2" />
				</div>
			</SelectTrigger>
			<SelectContent align="center" position="popper">
				<SelectItem key="assigned" value="assigned">
					{t('tasks.variant_filter.assigned')}
				</SelectItem>
				<SelectItem key="created" value="created">
					{t('tasks.variant_filter.created')}
				</SelectItem>
			</SelectContent>
		</Select>
	);
};
