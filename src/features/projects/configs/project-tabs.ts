import {
	ChartNoAxesCombined,
	InfoIcon,
	ListTodoIcon,
	type LucideIcon,
} from 'lucide-react';
import type { TranslationKey } from 'next-intl';
import type { IconType } from 'react-icons/lib';

export type ProjectTab = {
	value: 'tasks' | 'overview' | 'analytics';
	link: string;
	label: TranslationKey;
	icon: LucideIcon | IconType;
};

export const projectTabs: ProjectTab[] = [
	{
		value: 'tasks',
		link: '',
		label: 'common.tasks',
		icon: ListTodoIcon,
	},
	{
		value: 'overview',
		link: 'overview',
		label: 'common.overview',
		icon: InfoIcon,
	},
	{
		value: 'analytics',
		link: 'analytics',
		label: 'common.analytics',
		icon: ChartNoAxesCombined,
	},
];
