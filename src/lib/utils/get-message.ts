import type { TranslationKey, Translator } from 'next-intl';

export const getMessage = (value: string, t: Translator): string => {
	return t.has(value) ? t(value as TranslationKey) : value;
};
