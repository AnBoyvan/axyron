import {
	ChartNoAxesCombined,
	InfoIcon,
	ListTodoIcon,
	type LucideIcon,
	UsersIcon,
} from 'lucide-react';
import type { TranslationKey } from 'next-intl';
import type { IconType } from 'react-icons/lib';

export type ProjectTab = {
	value: 'tasks' | 'overview' | 'members' | 'analytics';
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
	// {
	// 	value: 'members',
	// 	link: 'members',
	// 	label: 'common.members',
	// 	icon: UsersIcon,
	// },
	{
		value: 'analytics',
		link: 'analytics',
		label: 'common.analytics',
		icon: ChartNoAxesCombined,
	},
];
