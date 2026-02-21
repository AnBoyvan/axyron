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
};

export const taskStatuses: Record<TaskStatusEnum, TaskStatusOption> = {
	pending: {
		value: TaskStatusEnum.pending,
		label: 'tasks.statuses.pending',
		icon: ClockFadingIcon,
		iconStyle: 'text-rose-600 dark:text-rose-400',
	},
	in_progress: {
		value: TaskStatusEnum.in_progress,
		label: 'tasks.statuses.in_progress',
		icon: Clock4Icon,
		iconStyle: 'text-blue-600 dark:text-blue-400',
	},
	in_review: {
		value: TaskStatusEnum.in_review,
		label: 'tasks.statuses.in_review',
		icon: ClockAlertIcon,
		iconStyle: 'text-orange-600 dark:text-orange-400',
	},
	completed: {
		value: TaskStatusEnum.completed,
		label: 'tasks.statuses.completed',
		icon: ClockCheckIcon,
		iconStyle: 'text-emerald-600 dark:text-emerald-400',
	},
	cancelled: {
		value: TaskStatusEnum.cancelled,
		label: 'tasks.statuses.cancelled',
		icon: CircleDashedIcon,
		iconStyle: 'text-red-600 dark:text-red-400',
	},
	overdue: {
		value: TaskStatusEnum.overdue,
		label: 'tasks.statuses.overdue',
		icon: CircleAlertIcon,
		iconStyle: 'text-red-600 dark:text-red-400',
	},
};

export const taskStatusOptions = Array.from(Object.values(taskStatuses));
