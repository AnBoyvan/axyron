import { TRPCClientError } from '@trpc/client';
import type { TranslationKey } from 'next-intl';

export const getErrorMessage = (
	error: unknown,
	fallback: TranslationKey,
): string => {
	if (error instanceof TRPCClientError) {
		return error.message;
	}

	if (error instanceof Error && typeof error.message === 'string') {
		return error.message;
	}

	return fallback;
};
