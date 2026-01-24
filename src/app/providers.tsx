'use client';

import type { PropsWithChildren } from 'react';

import { ThemeProvider } from 'next-themes';

import { ToastProvider } from '@/components/providers/toast-provider';

export const Providers = ({ children }: PropsWithChildren) => {
	return (
		<ThemeProvider
			attribute="class"
			storageKey="theme"
			enableSystem
			disableTransitionOnChange
		>
			<ToastProvider />
			{children}
		</ThemeProvider>
	);
};
