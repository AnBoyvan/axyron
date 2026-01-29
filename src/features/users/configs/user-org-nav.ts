import {
	CalendarDaysIcon,
	ClipboardListIcon,
	LayoutDashboardIcon,
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
		label: 'common.members',
		link: 'members',
		icon: UsersIcon,
	},
];
