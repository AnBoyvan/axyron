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
		badge:
			'border-neutral-500 text-neutral-500 dark:border-neutral-400 dark:text-neutral-400',
		cirkle: 'bg-neutral-500 dark:bg-neutral-400',
	},
	medium: {
		value: TaskPrority.medium,
		label: 'tasks.priority.medium',
		badge: 'border-green-500 text-green-500',
		cirkle: 'bg-green-500',
	},
	high: {
		value: TaskPrority.high,
		label: 'tasks.priority.high',
		badge: 'border-orange-500 text-orange-500',
		cirkle: 'bg-orange-500',
	},
	critical: {
		value: TaskPrority.critical,
		label: 'tasks.priority.critical',
		badge: 'border-red-500 text-red-500',
		cirkle: 'bg-red-500',
	},
};

export const taskPriorityOptions = Array.from(Object.values(taskPriority));
