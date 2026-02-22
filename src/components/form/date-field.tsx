/** biome-ignore-all lint/suspicious/noExplicitAny: use as shared form field */

import { useState } from 'react';

import { format } from 'date-fns';
import { CalendarCheckIcon, ChevronDownIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import type { Control } from 'react-hook-form';

import { fnsLocale } from '@/i18n/config';
import { cn } from '@/lib/utils/cn';

import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface DateFieldProps {
	control: Control<any, any>;
	name: string;
	label: string;
	placeholder: string;
	className?: string;
	disabled?: boolean;
}

export const DateField = ({
	control,
	name,
	label,
	className,
	placeholder,
	disabled,
}: DateFieldProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const t = useTranslations();
	const locale = useLocale();

	return (
		<FormField
			name={name}
			control={control}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<Popover open={isOpen} onOpenChange={setIsOpen}>
							<PopoverTrigger asChild>
								<Button
									variant="select"
									disabled={disabled}
									className={cn(
										'w-full justify-start overflow-hidden px-3 text-left font-normal',
										className,
									)}
								>
									<CalendarCheckIcon />
									{field.value ? (
										<span className="truncate text-foreground">
											{format(field.value, 'PPP', {
												locale: fnsLocale[locale],
											})}
										</span>
									) : (
										<span className="truncate">{placeholder}</span>
									)}
									<ChevronDownIcon className="ml-auto shrink-0 opacity-50" />
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0">
								<Calendar
									mode="single"
									selected={field.value ?? undefined}
									onSelect={date => {
										field.onChange(date);
										setIsOpen(false);
									}}
									locale={fnsLocale[locale]}
								/>

								<Button
									variant="outline"
									className="w-full rounded-none border-none"
									onClick={() => {
										field.onChange(null);
										setIsOpen(false);
									}}
								>
									{t('actions.reset')}
								</Button>
							</PopoverContent>
						</Popover>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
