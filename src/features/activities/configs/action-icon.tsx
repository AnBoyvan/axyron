import type { ReactNode } from 'react';

import {
	ArchiveIcon,
	ArchiveRestoreIcon,
	CalendarCheckIcon,
	CalendarSyncIcon,
	CheckCheckIcon,
	CircleAlertIcon,
	CircleDashedIcon,
	CircleXIcon,
	Clock4Icon,
	ClockAlertIcon,
	ClockCheckIcon,
	ClockFadingIcon,
	EyeIcon,
	FlagIcon,
	Globe2Icon,
	LockKeyholeIcon,
	type LucideIcon,
	PencilIcon,
	PlusIcon,
	Trash2Icon,
	UserMinusIcon,
	UserPlusIcon,
} from 'lucide-react';

import type { ActivityAction } from '../types';

export const taskActionIcon = {
	created: <PlusIcon className="size-5 text-green-600 dark:text-green-400" />,
	renamed: <PencilIcon className="size-5 text-blue-600 dark:text-blue-400" />,
	deleted: <CircleXIcon className="size-5 text-red-600 dark:text-red-400" />,
	assigned: (
		<UserPlusIcon className="size-5 text-indigo-600 dark:text-indigo-400" />
	),
	unassigned: (
		<UserMinusIcon className="size-5 text-orange-600 dark:text-orange-400" />
	),
	start_date: (
		<CalendarSyncIcon className="size-5 text-teal-600 dark:text-teal-400" />
	),
	due_date: (
		<CalendarCheckIcon className="size-5 text-amber-600 dark:text-amber-400" />
	),
	status: {
		completed: (
			<ClockCheckIcon className="size-5 text-emerald-600 dark:text-emerald-400" />
		),
		in_review: (
			<ClockAlertIcon className="size-5 text-orange-600 dark:text-orange-400" />
		),
		in_progress: (
			<Clock4Icon className="size-5 text-blue-600 dark:text-blue-400" />
		),
		pending: (
			<ClockFadingIcon className="size-5 text-fuchsia-600 dark:text-fuchsia-400" />
		),
		cancelled: (
			<CircleDashedIcon className="size-5 text-zinc-600 dark:text-zinc-400" />
		),
	},
};
