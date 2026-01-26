import {
	CalendarDaysIcon,
	ClipboardListIcon,
	LayoutDashboardIcon,
	ListTodoIcon,
	type LucideIcon,
	UsersIcon,
} from 'lucide-react';
import type { TranslationKey } from 'next-intl';
import type { IconType } from 'react-icons/lib';
import { PiVideoConferenceLight } from 'react-icons/pi';

type UserOrgNavItem = {
	label: TranslationKey;
	link: string;
	icon: LucideIcon | IconType;
};

export const userOrgNav: UserOrgNavItem[] = [
	{
		label: 'common.dashboard',
		link: '',
		icon: LayoutDashboardIcon,
	},
	{
		label: 'common.schedule',
		link: '/schedule',
		icon: CalendarDaysIcon,
	},
	{
		label: 'common.projects',
		link: '/projects',
		icon: ClipboardListIcon,
	},
	{
		label: 'common.tasks',
		link: '/tasks',
		icon: ListTodoIcon,
	},
	{
		label: 'common.meetings',
		link: '/meetings',
		icon: PiVideoConferenceLight,
	},
	{
		label: 'common.members',
		link: '/members',
		icon: UsersIcon,
	},
];
