'use client';

import type { TranslationKey } from 'next-intl';
import { ErrorBoundary } from 'react-error-boundary';

import { getErrorMessage } from '@/lib/utils/get-error-message';

import { ErrorState } from './error-state';

interface CustomErrorBoundaryProps {
	children: React.ReactNode;
	fallback: TranslationKey;
	description?: TranslationKey;
}

export const CustomErrorBoundary = ({
	children,
	fallback,
	description,
}: CustomErrorBoundaryProps) => {
	return (
		<ErrorBoundary
			fallbackRender={({ error }) => (
				<ErrorState
					title={getErrorMessage(error, fallback)}
					description={description}
				/>
			)}
		>
			{children}
		</ErrorBoundary>
	);
};
