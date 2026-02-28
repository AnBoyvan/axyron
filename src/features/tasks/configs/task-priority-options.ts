import type { TranslationKey } from 'next-intl';

import { TaskPrority } from '../types';

export type TaskPriorityOption = {
	value: TaskPrority;
	label: TranslationKey;
	badge: string;
	cirkle: string;
	oklch: string;
};

export const taskPriority: Record<TaskPrority, TaskPriorityOption> = {
	low: {
		value: TaskPrority.low,
		label: 'tasks.priority.low',
		badge: 'border-slate-500 text-slate-500',
		cirkle: 'bg-slate-500',
		oklch: 'oklch(55.4% 0.046 257.417)',
	},
	medium: {
		value: TaskPrority.medium,
		label: 'tasks.priority.medium',
		badge: 'border-green-500 text-green-500',
		cirkle: 'bg-green-500',
		oklch: 'oklch(72.3% 0.219 149.579)',
	},
	high: {
		value: TaskPrority.high,
		label: 'tasks.priority.high',
		badge: 'border-amber-500 text-amber-500',
		cirkle: 'bg-amber-500',
		oklch: 'oklch(76.9% 0.188 70.08)',
	},
	critical: {
		value: TaskPrority.critical,
		label: 'tasks.priority.critical',
		badge: 'border-red-500 text-red-500',
		cirkle: 'bg-red-500',
		oklch: 'oklch(63.7% 0.237 25.331)',
	},
};

export const taskPriorityOptions = Array.from(Object.values(taskPriority));
