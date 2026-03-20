'use server';

import type { Locale } from 'next-intl';

import { setUserLocale } from './user-locale';

export async function setLocaleAction(locale: Locale) {
	await setUserLocale(locale);
}
