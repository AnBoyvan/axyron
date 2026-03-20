'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { setLocaleAction } from '@/i18n/actions';

interface LocaleSwitcherProps {
	onSelect?: () => void;
}

export function LocaleSwitcher({ onSelect }: LocaleSwitcherProps) {
	const t = useTranslations('general.locale');

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="font-normal uppercase">
					{t('current')}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem
					onClick={() => {
						onSelect?.();
						setLocaleAction('uk');
					}}
				>
					{t('uk_full')}
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => {
						onSelect?.();
						setLocaleAction('en');
					}}
				>
					{t('en_full')}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
