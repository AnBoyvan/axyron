'use client';

import { useState } from 'react';

import { format } from 'date-fns';
import { CalendarCheckIcon, ChevronDownIcon } from 'lucide-react';
import { type TranslationKey, useLocale, useTranslations } from 'next-intl';

import { fnsLocale } from '@/i18n/config';
import { cn } from '@/lib/utils/cn';

import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface DatePickerProps {
	value: Date | undefined | null;
	onChange: (date: Date | null) => void;
	showReset?: boolean;
	className?: string;
	placeholder: TranslationKey;
}

export const DatePicker = ({
	value,
	onChange,
	className,
	placeholder,
	showReset,
}: DatePickerProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const t = useTranslations();
	const locale = useLocale();

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="select"
					className={cn(
						'w-full justify-start overflow-hidden px-3 text-left font-normal',
						className,
					)}
				>
					<CalendarCheckIcon />
					{value ? (
						<span className="truncate text-foreground">
							{format(value, 'PPP', { locale: fnsLocale[locale] })}
						</span>
					) : (
						<span className="truncate">{t(placeholder)}</span>
					)}
					<ChevronDownIcon className="ml-auto shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar
					mode="single"
					selected={value ?? undefined}
					onSelect={date => {
						onChange(date as Date);
						setIsOpen(false);
					}}
					locale={fnsLocale[locale]}
				/>
				{showReset && (
					<Button
						variant="outline"
						className="w-full rounded-none border-none"
						onClick={() => {
							onChange(null);
							setIsOpen(false);
						}}
					>
						{t('actions.reset')}
					</Button>
				)}
			</PopoverContent>
		</Popover>
	);
};
