import { enUS, uk } from 'date-fns/locale';
import type { Locale } from 'next-intl';

import actions from '@/messages/en/actions.json';
import auth from '@/messages/en/auth.json';
import common from '@/messages/en/common.json';
import general from '@/messages/en/general.json';
import meetings from '@/messages/en/meetings.json';
import members from '@/messages/en/members.json';
import orgs from '@/messages/en/orgs.json';
import projects from '@/messages/en/projects.json';
import tasks from '@/messages/en/tasks.json';
import users from '@/messages/en/users.json';

export const messages = {
	...actions,
	...auth,
	...common,
	...general,
	...meetings,
	...members,
	...orgs,
	...projects,
	...tasks,
	...users,
};

export const locales = ['en', 'uk'] as const;

export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

export const defaultLocale: Locale = 'en';

export const fnsLocale = {
	uk: uk,
	en: enUS,
};
