'use client';

import { useTranslations } from 'next-intl';
import type { Control, FieldValues, Path } from 'react-hook-form';

import {
	Field,
	FieldContent,
	FieldDescription,
	FieldLabel,
	FieldTitle,
} from '@/components/ui/field';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface VisibilitySelectProps<T extends FieldValues> {
	control: Control<T>;
	name: Path<T>;
	label?: string;
	disabled?: boolean;
}

export const VisibilitySelect = <T extends FieldValues>({
	control,
	name,
	label,
	disabled,
}: VisibilitySelectProps<T>) => {
	const t = useTranslations();

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					{!!label && <FormLabel>{label}</FormLabel>}
					<FormControl>
						<RadioGroup
							{...field}
							onValueChange={field.onChange}
							disabled={disabled}
							className="flex flex-col gap-2 md:flex-row"
						>
							<FieldLabel htmlFor="public" className="bg-popover">
								<Field orientation="horizontal">
									<FieldContent>
										<div className="flex items-center gap-2">
											<FieldTitle>{t('projects.public')}</FieldTitle>
										</div>
										<FieldDescription>
											{t('projects.public_description')}
										</FieldDescription>
									</FieldContent>
									<RadioGroupItem
										value="public"
										id="public"
										className="hidden"
									/>
								</Field>
							</FieldLabel>
							<FieldLabel htmlFor="private" className="bg-popover">
								<Field orientation="horizontal">
									<FieldContent>
										<FieldTitle>{t('projects.private')}</FieldTitle>
										<FieldDescription>
											{t('projects.private_description')}
										</FieldDescription>
									</FieldContent>
									<RadioGroupItem
										value="private"
										id="private"
										className="hidden"
									/>
								</Field>
							</FieldLabel>
						</RadioGroup>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
