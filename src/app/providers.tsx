'use client';

import type { PropsWithChildren } from 'react';

import { ThemeProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { ModalProvider } from '@/components/providers/modal-provider';
import { ToastProvider } from '@/components/providers/toast-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TRPCReactProvider } from '@/trpc/client';

export const Providers = ({ children }: PropsWithChildren) => {
	return (
		<NuqsAdapter>
			<TRPCReactProvider>
				<ThemeProvider
					attribute="class"
					storageKey="theme"
					enableSystem
					disableTransitionOnChange
				>
					<TooltipProvider>
						<ToastProvider />
						{children}
					</TooltipProvider>
					<ModalProvider />
				</ThemeProvider>
			</TRPCReactProvider>
		</NuqsAdapter>
	);
};
