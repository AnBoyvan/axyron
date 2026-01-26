import { getRequestConfig } from 'next-intl/server';

import { getUserLocale } from './user-locale';

export default getRequestConfig(async () => {
	const locale = await getUserLocale();

	return {
		locale,
		messages: {
			...(await import(`../../messages/${locale}/actions.json`)).default,
			...(await import(`../../messages/${locale}/auth.json`)).default,
			...(await import(`../../messages/${locale}/common.json`)).default,
			...(await import(`../../messages/${locale}/general.json`)).default,
			...(await import(`../../messages/${locale}/meetings.json`)).default,
			...(await import(`../../messages/${locale}/members.json`)).default,
			...(await import(`../../messages/${locale}/orgs.json`)).default,
			...(await import(`../../messages/${locale}/projects.json`)).default,
			...(await import(`../../messages/${locale}/tasks.json`)).default,
			...(await import(`../../messages/${locale}/users.json`)).default,
		},
	};
});
