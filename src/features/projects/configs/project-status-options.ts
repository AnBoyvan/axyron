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

export const projectStatuses: ProjectStatusOption[] = [
	{
		value: 'pending',
		label: 'projects.statuses.pending',
		icon: CircleDashedIcon,
		style: 'text-sky-700 dark:text-sky-400',
	},
	{
		value: 'active',
		label: 'projects.statuses.active',
		icon: CircleDotIcon,
		style: 'text-green-700 dark:text-green-500 ',
	},
	{
		value: 'closed',
		label: 'projects.statuses.closed',
		icon: CircleCheckBigIcon,
		style: 'text-red-700 dark:text-red-400',
	},
];
