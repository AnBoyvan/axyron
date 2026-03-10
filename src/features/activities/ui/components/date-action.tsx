import { format } from 'date-fns';
import { useLocale, useTranslations } from 'next-intl';

import { fnsLocale } from '@/i18n/config';

import type { Activity, ActivityMeta } from '../../types';

interface DateActionProps {
	activity: Activity;
}

export const DateAction = ({ activity }: DateActionProps) => {
	const t = useTranslations();
	const locale = useLocale();

	const meta = activity.meta as ActivityMeta | null;
	const isStart = activity.action === 'start_date';

	const dateKey: 'date_start' | 'date_due' = isStart
		? 'date_start'
		: 'date_due';

	const fromDate = meta?.from;
	const toDate = meta?.to;

	if (fromDate && toDate) {
		return (
			<>
				{t.rich(`activities.action.${dateKey}_changed`, {
					from: format(fromDate, 'dd-MM-yyyy', {
						locale: fnsLocale[locale],
					}),
					to: format(toDate, 'dd-MM-yyyy', {
						locale: fnsLocale[locale],
					}),
					b: chunks => <strong>{chunks}</strong>,
				})}
			</>
		);
	}

	if (!fromDate && toDate) {
		return (
			<>
				{t.rich(`activities.action.${dateKey}_set`, {
					to: format(toDate, 'dd-MM-yyyy', {
						locale: fnsLocale[locale],
					}),
					b: chunks => <strong>{chunks}</strong>,
				})}
			</>
		);
	}

	if (fromDate && !toDate) {
		return <>{t(`activities.action.${dateKey}_removed`)}</>;
	}

	return null;
};
