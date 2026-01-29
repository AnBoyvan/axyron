'use client';

import { Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export const ThemeToggle = () => {
	const t = useTranslations();
	const { resolvedTheme, setTheme } = useTheme();

	const toggleTheme = () => {
		setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
	};

	return (
		<Button size="icon-sm" variant="ghost" onClick={toggleTheme}>
			<Sun className="absolute size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
			<span className="sr-only">{t('general.theme.label')}</span>
		</Button>
	);
};
