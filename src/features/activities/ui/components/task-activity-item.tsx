'use client';

import { formatDistanceToNow } from 'date-fns';
import { useLocale, useTranslations } from 'next-intl';

import { UserAvatar } from '@/features/users/ui/components/user-avatar';
import { fnsLocale } from '@/i18n/config';

import { renderAction } from '../../configs/render-action';
import type { Activity } from '../../types';

interface TaskActivityItemProps {
	activity: Activity;
}

export const TaskActivityItem = ({ activity }: TaskActivityItemProps) => {
	const t = useTranslations();
	const locale = useLocale();

	const authorName = activity.author?.name ?? t('users.deleted');

	return (
		<div className="relative flex gap-3">
			<UserAvatar
				size="sm"
				imageUrl={activity.author?.image}
				name={authorName}
			/>
			<div className="flex flex-col gap-0.5">
				<p className="text-wrap text-sm leading-5">
					<span className="font-semibold">{authorName}</span>
					{renderAction(activity)}
				</p>
				<span className="text-muted-foreground text-xs">
					{formatDistanceToNow(activity.createdAt, {
						addSuffix: true,
						locale: fnsLocale[locale],
					})}
				</span>
			</div>
		</div>
	);
};
