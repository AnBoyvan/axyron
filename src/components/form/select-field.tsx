/** biome-ignore-all lint/suspicious/noExplicitAny: use as shared form field */
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
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

interface SelectFieldProps {
	control: Control<any, any>;
	name: string;
	label: string;
	placeholder?: string;
	disabled?: boolean;
	children: React.ReactNode;
	className?: string;
}

export const SelectField = ({
	control,
	name,
	label,
	placeholder,
	disabled,
	children,
	className,
}: SelectFieldProps) => {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<Select
						disabled={disabled}
						onValueChange={field.onChange}
						defaultValue={field.value ?? undefined}
					>
						<FormControl>
							<SelectTrigger className={className}>
								<SelectValue placeholder={placeholder} />
							</SelectTrigger>
						</FormControl>
						<SelectContent align="center" position="popper">
							{children}
						</SelectContent>
					</Select>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
