import { cookies } from 'next/headers';

import type { Locale } from 'next-intl';

import { getBrowserLocale } from './browser-locale';
import { defaultLocale, LOCALE_COOKIE_NAME } from './config';
import { isLocale } from './is-locale';

export async function getUserLocale(): Promise<Locale> {
	const reqCookies = await cookies();

	const currentLocale = reqCookies.get(LOCALE_COOKIE_NAME)?.value;

	if (currentLocale && isLocale(currentLocale)) {
		return currentLocale;
	}

	const browserLocale = await getBrowserLocale();

	if (browserLocale && isLocale(browserLocale)) {
		return browserLocale;
	}

	return defaultLocale;
}

export async function setUserLocale(locale: Locale) {
	const reqCookies = await cookies();

	reqCookies.set(LOCALE_COOKIE_NAME, locale);
}
