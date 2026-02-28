import {
	CircleAlertIcon,
	CircleDashedIcon,
	Clock4Icon,
	ClockAlertIcon,
	ClockCheckIcon,
	ClockFadingIcon,
	type LucideIcon,
} from 'lucide-react';
import type { TranslationKey } from 'next-intl';
import type { IconType } from 'react-icons/lib';

import { TaskStatusEnum } from '../types';

export type TaskStatusOption = {
	value: TaskStatusEnum;
	label: TranslationKey;
	icon: LucideIcon | IconType;
	iconStyle: string;
	oklch: string;
};

export const taskStatuses: Record<TaskStatusEnum, TaskStatusOption> = {
	overdue: {
		value: TaskStatusEnum.overdue,
		label: 'tasks.statuses.overdue',
		icon: CircleAlertIcon,
		iconStyle: 'text-red-600 dark:text-red-500',
		oklch: 'oklch(63.7% 0.237 25.331)',
	},
	completed: {
		value: TaskStatusEnum.completed,
		label: 'tasks.statuses.completed',
		icon: ClockCheckIcon,
		iconStyle: 'text-emerald-600 dark:text-emerald-400',
		oklch: 'oklch(69.6% 0.17 162.48)',
	},
	in_review: {
		value: TaskStatusEnum.in_review,
		label: 'tasks.statuses.in_review',
		icon: ClockAlertIcon,
		iconStyle: 'text-orange-600 dark:text-orange-400',
		oklch: 'oklch(70.5% 0.213 47.604)',
	},
	in_progress: {
		value: TaskStatusEnum.in_progress,
		label: 'tasks.statuses.in_progress',
		icon: Clock4Icon,
		iconStyle: 'text-blue-600 dark:text-blue-400',
		oklch: 'oklch(62.3% 0.214 259.815)',
	},
	pending: {
		value: TaskStatusEnum.pending,
		label: 'tasks.statuses.pending',
		icon: ClockFadingIcon,
		iconStyle: 'text-fuchsia-600 dark:text-fuchsia-400',
		oklch: 'oklch(66.7% 0.295 322.15)',
	},
	cancelled: {
		value: TaskStatusEnum.cancelled,
		label: 'tasks.statuses.cancelled',
		icon: CircleDashedIcon,
		iconStyle: 'text-zinc-600 dark:text-zinc-400',
		oklch: 'oklch(55.2% 0.016 285.938)',
	},
};

export const taskStatusOptions = Array.from(Object.values(taskStatuses));
