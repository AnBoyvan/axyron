import type { Locale } from 'next-intl';

import general from '@/messages/en/general.json';
export const locales = ['en', 'uk'] as const;

export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

export const defaultLocale: Locale = 'en';

export const messages = {
	...general,
};
