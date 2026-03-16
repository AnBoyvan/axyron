import {
	type inferParserType,
	parseAsIsoDate,
	parseAsString,
	parseAsStringEnum,
	useQueryStates,
} from 'nuqs';

import { TaskPriorityEnum, TaskStatusEnum } from '../types';

const statusValues = Object.values(TaskStatusEnum);
const priorityValues = Object.values(TaskPriorityEnum);
const variants = ['assigned', 'created'];

const tasksFiltersParsers = {
	search: parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
	status: parseAsStringEnum(statusValues).withOptions({ clearOnDefault: true }),
	priority: parseAsStringEnum(priorityValues).withOptions({
		clearOnDefault: true,
	}),
	assignee: parseAsString.withOptions({ clearOnDefault: true }),
	dueDateTo: parseAsIsoDate.withOptions({ clearOnDefault: true }),
	variant: parseAsStringEnum(variants).withOptions({ clearOnDefault: true }),
	project: parseAsString.withOptions({ clearOnDefault: true }),
	organization: parseAsString.withOptions({ clearOnDefault: true }),
} as const;

export type TasksFilters = inferParserType<typeof tasksFiltersParsers>;

export const useTasksFilters = () => {
	const [filters, setFilters] = useQueryStates(tasksFiltersParsers);

	const resetFilters = () => {
		setFilters({
			search: null,
			status: null,
			assignee: null,
			priority: null,
			dueDateTo: null,
			project: null,
			organization: null,
		});
	};

	return {
		filters,
		setFilters,
		resetFilters,
	};
};
