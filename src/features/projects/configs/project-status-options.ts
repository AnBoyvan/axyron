import {
	CircleCheckBigIcon,
	CircleDashedIcon,
	CircleDotIcon,
	type LucideIcon,
} from 'lucide-react';
import type { TranslationKey } from 'next-intl';
import type { IconType } from 'react-icons/lib';

import type { ProjectById } from '../types';

export type ProjectStatusOption = {
	value: ProjectById['status'];
	label: TranslationKey;
	icon: LucideIcon | IconType;
	style: string;
};

export const projectStatusTextColor = {
	pending: 'text-sky-700 dark:text-sky-400',
	active: 'text-green-700 dark:text-green-500',
	closed: 'text-red-700 dark:text-red-400',
};

export const projectStatuses: ProjectStatusOption[] = [
	{
		value: 'pending',
		label: 'projects.statuses.pending',
		icon: CircleDashedIcon,
		style: projectStatusTextColor.pending,
	},
	{
		value: 'active',
		label: 'projects.statuses.active',
		icon: CircleDotIcon,
		style: projectStatusTextColor.active,
	},
	{
		value: 'closed',
		label: 'projects.statuses.closed',
		icon: CircleCheckBigIcon,
		style: projectStatusTextColor.closed,
	},
];
