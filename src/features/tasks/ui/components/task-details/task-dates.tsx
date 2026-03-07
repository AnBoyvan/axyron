import { format } from 'date-fns';
import { CalendarCheck2Icon, CalendarSyncIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import type { TaskById } from '@/features/tasks/types';
import { fnsLocale } from '@/i18n/config';
import { cn } from '@/lib/utils/cn';

interface TaskDatesProps {
	startDate: TaskById['startDate'];
	dueDate: TaskById['dueDate'];
	isOverdue?: boolean;
}

export const TaskDates = ({
	startDate,
	dueDate,
	isOverdue,
}: TaskDatesProps) => {
	const t = useTranslations();
	const locale = useLocale();

	return (
		<div className="flex gap-8">
			{startDate && (
				<div className="flex flex-col">
					<div className="flex h-8 items-center gap-2 text-muted-foreground">
						<CalendarSyncIcon className="size-4" />
						<h2 className="font-semibold text-base">
							{t('common.start_date')}
						</h2>
					</div>
					<p>
						{format(startDate, 'dd MMMM yyyy', {
							locale: fnsLocale[locale],
						})}
					</p>
				</div>
			)}
			{dueDate && (
				<div className={cn('flex flex-col', isOverdue && 'text-destructive')}>
					<div className="flex h-8 items-center gap-2 text-muted-foreground">
						<CalendarCheck2Icon className="size-4" />
						<h2 className="font-semibold text-base">{t('common.due_date')}</h2>
					</div>
					<p>
						{format(dueDate, 'dd MMMM yyyy', {
							locale: fnsLocale[locale],
						})}
					</p>
				</div>
			)}
		</div>
	);
};
