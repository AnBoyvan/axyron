import type { TranslationKey } from 'next-intl';

import { TaskPriorityEnum } from '../types';

export type TaskPriorityOption = {
	value: TaskPriorityEnum;
	label: TranslationKey;
	badge: string;
	cirkle: string;
	oklch: string;
	text: string;
};

export const taskPriority: Record<TaskPriorityEnum, TaskPriorityOption> = {
	low: {
		value: TaskPriorityEnum.low,
		label: 'tasks.priority.low',
		badge: 'border-slate-500 text-slate-500',
		cirkle: 'bg-slate-500',
		oklch: 'oklch(55.4% 0.046 257.417)',
		text: 'text-slate-500',
	},
	medium: {
		value: TaskPriorityEnum.medium,
		label: 'tasks.priority.medium',
		badge: 'border-green-500 text-green-500',
		cirkle: 'bg-green-500',
		oklch: 'oklch(72.3% 0.219 149.579)',
		text: 'text-green-500',
	},
	high: {
		value: TaskPriorityEnum.high,
		label: 'tasks.priority.high',
		badge: 'border-amber-500 text-amber-500',
		cirkle: 'bg-amber-500',
		oklch: 'oklch(76.9% 0.188 70.08)',
		text: 'text-amber-500',
	},
	critical: {
		value: TaskPriorityEnum.critical,
		label: 'tasks.priority.critical',
		badge: 'border-red-500 text-red-500',
		cirkle: 'bg-red-500',
		oklch: 'oklch(63.7% 0.237 25.331)',
		text: 'text-red-500',
	},
};

export const taskPriorityOptions = Array.from(Object.values(taskPriority));
