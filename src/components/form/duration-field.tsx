/** biome-ignore-all lint/suspicious/noExplicitAny: use as shared form field */

import { useLocale } from 'next-intl';
import type { Control } from 'react-hook-form';

import { MEETING_DURATION_OPTIONS } from '@/features/meetings/constants';
import { fnsLocale } from '@/i18n/config';
import { cn } from '@/lib/utils/cn';
import { formatDuration } from '@/lib/utils/format-duration';

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select';

interface DurationFieldProps {
	control: Control<any, any>;
	name: string;
	label: string;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
}

export const DurationField = ({
	control,
	name,
	label,
	placeholder,
	disabled,
	className,
}: DurationFieldProps) => {
	const locale = useLocale();

	return (
		<FormField
			name={name}
			control={control}
			render={({ field }) => (
				<FormItem className={cn(className)}>
					<FormLabel>{label}</FormLabel>
					<Select
						disabled={disabled}
						defaultValue={field.value != null ? String(field.value) : undefined}
						value={field.value != null ? String(field.value) : undefined}
						onValueChange={value => field.onChange(Number(value))}
					>
						<FormControl>
							<SelectTrigger className="w-full">
								<SelectValue placeholder={placeholder} />
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							{MEETING_DURATION_OPTIONS.map(option => (
								<SelectItem key={option.value} value={option.value.toString()}>
									{formatDuration(option.value, fnsLocale[locale])}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
