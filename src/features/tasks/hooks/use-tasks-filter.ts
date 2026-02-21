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

const tasksFiltersParsers = {
	search: parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
	status: parseAsStringEnum(statusValues).withOptions({ clearOnDefault: true }),
	priority: parseAsStringEnum(priorityValues).withOptions({
		clearOnDefault: true,
	}),
	assignee: parseAsString.withOptions({ clearOnDefault: true }),
	dueDateTo: parseAsIsoDate.withOptions({ clearOnDefault: true }),
} as const;

export type TasksFilters = inferParserType<typeof tasksFiltersParsers>;

export const useTasksFilters = () => {
	return useQueryStates(tasksFiltersParsers);
};
