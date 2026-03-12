import {
	CalendarDaysIcon,
	ClipboardListIcon,
	CreditCardIcon,
	LayoutDashboardIcon,
	ListTodoIcon,
	type LucideIcon,
	SettingsIcon,
	UsersIcon,
} from 'lucide-react';
import type { TranslationKey } from 'next-intl';
import type { IconType } from 'react-icons/lib';
import { PiVideoConferenceLight } from 'react-icons/pi';

type OrgNavItem = {
	label: TranslationKey;
	link: string;
	icon: LucideIcon | IconType;
};

export const orgMembersNav: OrgNavItem[] = [
	{
		label: 'common.dashboard',
		link: 'dashboard',
		icon: LayoutDashboardIcon,
	},
	{
		label: 'common.calendar',
		link: 'calendar',
		icon: CalendarDaysIcon,
	},
	{
		label: 'common.projects',
		link: 'projects',
		icon: ClipboardListIcon,
	},
	{
		label: 'common.meetings',
		link: 'meetings',
		icon: PiVideoConferenceLight,
	},
	{
		label: 'users.my_tasks',
		link: 'tasks',
		icon: ListTodoIcon,
	},
];

export const orgAdminsNav: OrgNavItem[] = [
	{
		label: 'common.members',
		link: 'members',
		icon: UsersIcon,
	},
	{
		label: 'common.settings',
		link: 'settings',
		icon: SettingsIcon,
	},
	{
		label: 'common.billing',
		link: 'billing',
		icon: CreditCardIcon,
	},
];
