import type { locales, messages } from '@/i18n/config';
import type { formats } from '@/i18n/request';

declare module 'next-intl' {
	interface AppConfig {
		Locale: (typeof locales)[number];
		Messages: typeof messages;
		Formats: typeof formats;
	}

	type TranslationKey = NestedKeyOf<Messages>;

	type Translator = ReturnType<typeof useTranslations>;
}
