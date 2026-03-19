import { zodResolver } from '@hookform/resolvers/zod';
import { SaveIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { InputField } from '@/components/form/input-field';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';

import { useProfile } from '../../hooks/use-profile';
import { useUpdatePassword } from '../../hooks/use-update-password';
import {
	type ChangePassworgSchema,
	changePassworgSchema,
} from '../../schemas/change-password-schema';

export const ChangePasswordForm = () => {
	const t = useTranslations();

	const { data } = useProfile();

	const updatePassword = useUpdatePassword();

	const form = useForm<ChangePassworgSchema>({
		resolver: zodResolver(changePassworgSchema),
		defaultValues: {
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		},
	});

	const onSubmit = (values: ChangePassworgSchema) => {
		updatePassword.mutate({
			currentPassword: values.currentPassword,
			newPassword: values.newPassword,
		});
	};

	if (data?.hasPassword) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>{t('auth.password_change')}</CardTitle>
					<CardDescription>{t('users.password_oauth_hint')}</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t('auth.password_change')}</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<InputField
							control={form.control}
							disabled={updatePassword.isPending}
							name="currentPassword"
							label={t('auth.current_password')}
							placeholder={t('auth.password_placeholder')}
						/>
						<InputField
							control={form.control}
							disabled={updatePassword.isPending}
							name="newPassword"
							label={t('auth.new_password')}
							placeholder={t('auth.password_placeholder')}
						/>
						<InputField
							control={form.control}
							disabled={updatePassword.isPending}
							name="confirmPassword"
							label={t('auth.confirm_password')}
							placeholder={t('auth.password_placeholder')}
						/>
						<div className="flex w-full">
							<Button
								type="submit"
								disabled={
									updatePassword.isPending ||
									((!form.formState.touchedFields.currentPassword ||
										!form.formState.touchedFields.newPassword ||
										!form.formState.touchedFields.confirmPassword) &&
										!form.formState.isValid)
								}
							>
								<SaveIcon />
								{t('actions.save')}
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};

export const ChangePasswordFormSkeleton = () => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<Skeleton className="h-4 w-40" />
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="space-y-2">
						<Skeleton className="h-3.5 w-24" />
						<Skeleton className="h-9 w-full" />
					</div>
					<div className="space-y-2">
						<Skeleton className="h-3.5 w-24" />
						<Skeleton className="h-9 w-full" />
					</div>
					<div className="space-y-2">
						<Skeleton className="h-3.5 w-24" />
						<Skeleton className="h-9 w-full" />
					</div>
					<Skeleton className="h-9 w-20" />
				</div>
			</CardContent>
		</Card>
	);
};
