import type { Control, FieldValues, Path } from 'react-hook-form';

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils/cn';

import { Textarea } from '../ui/textarea';

interface TextareaFieldProps<T extends FieldValues> {
	control: Control<T>;
	name: Path<T>;
	label?: string;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	cols?: number;
	rows?: number;
	maxLenght?: number;
}

export const TextareaField = <T extends FieldValues>({
	control,
	name,
	label,
	placeholder,
	disabled,
	className,
	cols,
	rows,
	maxLenght,
}: TextareaFieldProps<T>) => {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					{label && <FormLabel>{label}</FormLabel>}
					<FormControl>
						<Textarea
							{...field}
							value={field.value ?? ''}
							rows={rows}
							cols={cols}
							disabled={disabled}
							placeholder={placeholder}
							className={cn(className)}
							maxLength={maxLenght}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
