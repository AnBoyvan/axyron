import {
	BarChart2Icon,
	CalendarIcon,
	CheckSquareIcon,
	GlobeIcon,
	KanbanIcon,
	type LucideIcon,
	UsersIcon,
} from 'lucide-react';
import type { TranslationKey } from 'next-intl';

export type Feature = {
	icon: LucideIcon;
	title: TranslationKey;
	description: TranslationKey;
};

export const features: Feature[] = [
	{
		icon: CheckSquareIcon,
		title: 'home.features.task_management.title',
		description: 'home.features.task_management.description',
	},
	{
		icon: KanbanIcon,
		title: 'home.features.project_tracking.title',
		description: 'home.features.project_tracking.description',
	},
	{
		icon: CalendarIcon,
		title: 'home.features.calendar.title',
		description: 'home.features.calendar.description',
	},
	{
		icon: BarChart2Icon,
		title: 'home.features.analytics.title',
		description: 'home.features.analytics.description',
	},
	{
		icon: UsersIcon,
		title: 'home.features.meetings.title',
		description: 'home.features.meetings.description',
	},
	{
		icon: GlobeIcon,
		title: 'home.features.multilang.title',
		description: 'home.features.multilang.description',
	},
];
