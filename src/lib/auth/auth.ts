import { i18n } from '@better-auth/i18n';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { db } from '@/db';
import { account } from '@/db/schema/account';
import { session } from '@/db/schema/session';
import { user } from '@/db/schema/user';
import { verification } from '@/db/schema/verification';
import { LOCALE_COOKIE_NAME } from '@/i18n/config';

import { translations } from './translations';

export const auth = betterAuth({
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		},
	},
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: {
			user,
			session,
			account,
			verification,
		},
	}),
	plugins: [
		i18n({
			detection: ['cookie', 'header'],
			localeCookie: LOCALE_COOKIE_NAME,
			translations: {
				uk: translations.uk,
			},
		}),
	],
});
