import { useTranslations } from 'next-intl';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import {
	ChangePasswordForm,
	ChangePasswordFormSkeleton,
} from '../components/change-password-form';
import {
	UserImageSelect,
	UserImageSelectSkeleton,
} from '../components/user-image-select';
import {
	UserInfoForm,
	UserInfoFormSkeleton,
} from '../components/user-info-form';

export const ProfileSection = () => {
	const t = useTranslations();

	return (
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
			<Card className="lg:col-span-2">
				<CardHeader>
					<CardTitle className="text-2xl">{t('users.my_profile')}</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-8">
					<UserImageSelect />
					<UserInfoForm />
				</CardContent>
			</Card>
			<ChangePasswordForm />
		</div>
	);
};

export const ProfileSectionSkeleton = () => {
	return (
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
			<Card className="lg:col-span-2">
				<CardHeader>
					<CardTitle className="h-8 py-1">
						<Skeleton className="h-6 w-32" />
					</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-8">
					<UserImageSelectSkeleton />
					<UserInfoFormSkeleton />
				</CardContent>
			</Card>
			<ChangePasswordFormSkeleton />
		</div>
	);
};
