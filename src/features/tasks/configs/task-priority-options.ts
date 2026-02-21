import type { TranslationKey } from 'next-intl';

import { TaskPrority } from '../types';

export type TaskPriorityOption = {
	value: TaskPrority;
	label: TranslationKey;
	badge: string;
	cirkle: string;
};

export const taskPriority: Record<TaskPrority, TaskPriorityOption> = {
	low: {
		value: TaskPrority.low,
		label: 'tasks.priority.low',
		badge: '',
		cirkle: 'bg-neutral-500',
	},
	medium: {
		value: TaskPrority.medium,
		label: 'tasks.priority.medium',
		badge: '',
		cirkle: 'bg-green-500',
	},
	high: {
		value: TaskPrority.high,
		label: 'tasks.priority.high',
		badge: '',
		cirkle: 'bg-orange-500',
	},
	critical: {
		value: TaskPrority.critical,
		label: 'tasks.priority.critical',
		badge: '',
		cirkle: 'bg-red-500',
	},
};

export const taskPriorityOptions = Array.from(Object.values(taskPriority));
