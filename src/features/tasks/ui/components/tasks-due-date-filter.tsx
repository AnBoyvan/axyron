import { DatePicker } from '@/components/shared/date-picker';

import type { TasksFilters } from '../../hooks/use-tasks-filter';

interface TasksStatusFilterProps {
	value: TasksFilters['dueDateTo'];
	onChange: (value: TasksFilters['dueDateTo']) => void;
}

export const TasksDueDateFilter = ({
	value,
	onChange,
}: TasksStatusFilterProps) => {
	return (
		<DatePicker
			value={value}
			onChange={onChange}
			placeholder={'common.due_date'}
			showReset
			className="text-muted-foreground"
		/>
	);
};
