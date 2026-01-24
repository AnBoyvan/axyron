import type { Locale } from 'next-intl';

import auth from '@/messages/en/auth.json';
import common from '@/messages/en/common.json';
import general from '@/messages/en/general.json';

export const messages = {
	...auth,
	...common,
	...general,
};

export const locales = ['en', 'uk'] as const;

export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

export const defaultLocale: Locale = 'en';
