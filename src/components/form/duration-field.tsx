/** biome-ignore-all lint/suspicious/noExplicitAny: use as shared form field */

import type { Control } from 'react-hook-form';

import { cn } from '@/lib/utils/cn';

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

const DURATION_OPTIONS = [
	{ value: 15, label: '15 min' },
	{ value: 30, label: '30 min' },
	{ value: 45, label: '45 min' },
	{ value: 60, label: '1 hour' },
	{ value: 90, label: '1.5 hours' },
	{ value: 120, label: '2 hours' },
] as const;

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
							{DURATION_OPTIONS.map(option => (
								<SelectItem key={option.value} value={option.value.toString()}>
									{option.label}
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
