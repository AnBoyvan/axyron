import { zodResolver } from '@hookform/resolvers/zod';
import { SaveIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { InputField } from '@/components/form/input-field';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

import { useProfile } from '../../hooks/use-profile';
import { useUpdateProfile } from '../../hooks/use-update-profile';
import {
	type UpdateProfileSchema,
	updateProfileSchema,
} from '../../schemas/update-profile-schema';

export const UserInfoForm = () => {
	const t = useTranslations();

	const { data } = useProfile();
	const updateProfile = useUpdateProfile();

	const form = useForm<UpdateProfileSchema>({
		resolver: zodResolver(updateProfileSchema),
		defaultValues: { name: data.name, phone: data.phone ?? '' },
	});

	const onSubmit = (values: UpdateProfileSchema) => {
		updateProfile.mutate({
			...values,
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<InputField
					control={form.control}
					disabled={updateProfile.isPending}
					name="name"
					label={t('users.name')}
					placeholder={t('users.name_placeholder')}
				/>
				<div className="space-y-2">
					<Label>{t('common.email')}</Label>
					<div className="bg:transparent flex h-9 w-full min-w-0 items-center rounded-md border border-input px-3 py-1 text-muted-foreground text-sm shadow-xs dark:bg-input/30">
						{data.email}
					</div>
					<p className="text-muted-foreground text-xs italic">
						{t('users.email_cannot_change')}
					</p>
				</div>
				<InputField
					control={form.control}
					disabled={updateProfile.isPending}
					name="phone"
					label={t('users.phone')}
					placeholder={t('users.phone_placeholder')}
				/>
				<div className="flex w-full">
					<Button
						type="submit"
						disabled={
							updateProfile.isPending ||
							((!form.formState.touchedFields.name ||
								!form.formState.touchedFields.phone) &&
								!form.formState.isValid)
						}
					>
						<SaveIcon />
						{t('actions.save')}
					</Button>
				</div>
			</form>
		</Form>
	);
};

export const UserInfoFormSkeleton = () => {
	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Skeleton className="h-3.5 w-12" />
				<Skeleton className="h-9 w-full" />
			</div>
			<div className="space-y-2 pb-1">
				<Skeleton className="h-3.5 w-12" />
				<Skeleton className="h-9 w-full" />
				<Skeleton className="h-3 w-64" />
			</div>
			<div className="space-y-2">
				<Skeleton className="h-3.5 w-24" />
				<Skeleton className="h-9 w-full" />
			</div>
			<Skeleton className="h-9 w-20" />
		</div>
	);
};
