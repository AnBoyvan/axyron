import {
	CalendarDaysIcon,
	ClipboardListIcon,
	LayoutDashboardIcon,
	ListTodoIcon,
	type LucideIcon,
} from 'lucide-react';
import type { TranslationKey } from 'next-intl';
import type { IconType } from 'react-icons/lib';
import { PiVideoConferenceLight } from 'react-icons/pi';

type UserNavItem = {
	label: TranslationKey;
	link: string;
	icon: LucideIcon | IconType;
};

export const userNav: UserNavItem[] = [
	{
		label: 'common.dashboard',
		link: '/',
		icon: LayoutDashboardIcon,
	},
	{
		label: 'common.calendar',
		link: '/calendar',
		icon: CalendarDaysIcon,
	},
	{
		label: 'common.projects',
		link: '/projects',
		icon: ClipboardListIcon,
	},
	{
		label: 'common.meetings',
		link: '/meetings',
		icon: PiVideoConferenceLight,
	},
	{
		label: 'users.my_tasks',
		link: '/tasks',
		icon: ListTodoIcon,
	},
];
