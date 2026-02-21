import {
	CalendarDaysIcon,
	ClipboardListIcon,
	LayoutDashboardIcon,
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
	adminOnly: boolean;
};

export const orgNav: OrgNavItem[] = [
	{
		label: 'common.dashboard',
		link: 'dashboard',
		icon: LayoutDashboardIcon,
		adminOnly: false,
	},
	{
		label: 'common.calendar',
		link: 'calendar',
		icon: CalendarDaysIcon,
		adminOnly: false,
	},
	{
		label: 'common.projects',
		link: 'projects',
		icon: ClipboardListIcon,
		adminOnly: false,
	},
	{
		label: 'common.meetings',
		link: 'meetings',
		icon: PiVideoConferenceLight,
		adminOnly: false,
	},
	{
		label: 'common.members',
		link: 'members',
		icon: UsersIcon,
		adminOnly: false,
	},
	{
		label: 'common.settings',
		link: 'settings',
		icon: SettingsIcon,
		adminOnly: true,
	},
];
