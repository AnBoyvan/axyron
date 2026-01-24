'use client';

import { type HTMLInputTypeAttribute, useState } from 'react';

import { EyeIcon, EyeOffIcon } from 'lucide-react';
import type { Control, FieldValues, Path } from 'react-hook-form';

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils/cn';

import { Button } from '../ui/button';

interface InputFieldProps<T extends FieldValues> {
	control: Control<T>;
	name: Path<T>;
	type?: HTMLInputTypeAttribute;
	label?: string;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
}

export const InputField = <T extends FieldValues>({
	control,
	name,
	type = 'text',
	label,
	placeholder,
	disabled,
	className,
}: InputFieldProps<T>) => {
	const [show, setShow] = useState(false);

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					{!!label && <FormLabel>{label}</FormLabel>}
					<FormControl>
						<div className="relative">
							<Input
								{...field}
								type={show ? 'text' : type}
								disabled={disabled}
								placeholder={placeholder}
								className={cn(className)}
							/>

							{type === 'password' && (
								<Button
									type="button"
									size="icon"
									variant="ghost"
									onClick={() => setShow(prev => !prev)}
									className="absolute top-1/2 right-2 size-5 -translate-y-1/2"
								>
									{show ? <EyeOffIcon /> : <EyeIcon />}
								</Button>
							)}
						</div>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
