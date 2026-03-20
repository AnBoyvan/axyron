import type { TranslationDictionary } from '@better-auth/i18n';

export const translations: Record<string, TranslationDictionary> = {
	uk: {
		USER_NOT_FOUND: 'Користувача не знайдено',
		INVALID_EMAIL_OR_PASSWORD: 'Невірний email або пароль',
		INVALID_PASSWORD: 'Невірний пароль',
		EMAIL_NOT_VERIFIED: 'Email не підтверджено',
		SESSION_EXPIRED: 'Сесія закінчилася',
		CREDENTIAL_ACCOUNT_NOT_FOUND: 'Акаунт не знайдено',
		USER_ALREADY_EXISTS: 'Користувач вже існує',
		EMAIL_ALREADY_IN_USE: 'Цей email вже використовується',
		UNAUTHORIZED: 'Немає доступу',
		FORBIDDEN: 'Заборонено',
		RATE_LIMIT_EXCEEDED: 'Забагато запитів. Спробуйте пізніше',
		INTERNAL_SERVER_ERROR: 'Внутрішня помилка сервера',
	},
};
