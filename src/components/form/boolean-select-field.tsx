/** biome-ignore-all lint/suspicious/noExplicitAny: use as shared form field */

import { useTranslations } from 'next-intl';
import type { Control } from 'react-hook-form';

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

interface BooleanSelectFieldProps {
	control: Control<any, any>;
	name: string;
	label: string;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
}

export const BooleanSelectField = ({
	control,
	name,
	label,
	placeholder,
	disabled,
	className,
}: BooleanSelectFieldProps) => {
	const t = useTranslations();

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel className="line-clamp-1">{label}</FormLabel>
					<Select
						disabled={disabled}
						onValueChange={value => {
							field.onChange(Boolean(value === 'yes'));
						}}
						defaultValue={field.value === true ? 'yes' : 'no'}
					>
						<FormControl>
							<SelectTrigger className={className}>
								<SelectValue placeholder={placeholder} />
							</SelectTrigger>
						</FormControl>
						<SelectContent align="center" position="popper">
							<SelectItem value={'yes'}>{t('tasks.yes')}</SelectItem>
							<SelectItem value={'no'}>{t('tasks.no')}</SelectItem>
						</SelectContent>
					</Select>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
