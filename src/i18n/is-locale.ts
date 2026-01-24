import type { Locale } from 'next-intl';

import { locales } from './config';

export function isLocale(value: string): value is Locale {
	return locales.includes(value as Locale);
}
