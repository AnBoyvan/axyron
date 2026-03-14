import { format } from 'date-fns';
import { CalendarCheck2Icon, CalendarSyncIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import type { Task } from '@/features/tasks/types';
import { fnsLocale } from '@/i18n/config';
import { cn } from '@/lib/utils/cn';

interface TaskPreviewDatesProps {
	startDate: Task['startDate'];
	dueDate: Task['dueDate'];
	isOverdue?: boolean;
}

export const TaskPreviewDates = ({
	startDate,
	dueDate,
	isOverdue,
}: TaskPreviewDatesProps) => {
	const t = useTranslations();
	const locale = useLocale();
	const dateLocale = fnsLocale[locale];

	return (
		<div className="flex gap-6">
			{startDate && (
				<div className="flex flex-col gap-0.5">
					<div className="flex items-center gap-1.5 text-muted-foreground">
						<CalendarSyncIcon className="size-3.5" />
						<span className="font-medium text-xs uppercase leading-0 tracking-wide">
							{t('common.start_date')}
						</span>
					</div>
					<span className="text-sm">
						{format(startDate, 'dd MMM yyyy', { locale: dateLocale })}
					</span>
				</div>
			)}
			{dueDate && (
				<div
					className={cn(
						'flex flex-col gap-0.5',
						isOverdue && 'text-destructive',
					)}
				>
					<div
						className={cn(
							'flex items-center gap-1.5',
							isOverdue ? 'text-destructive' : 'text-muted-foreground',
						)}
					>
						<CalendarCheck2Icon className="size-3.5" />
						<span className="font-medium text-xs uppercase leading-0 tracking-wide">
							{t('common.due_date')}
						</span>
					</div>
					<span className="text-sm">
						{format(dueDate, 'dd MMM yyyy', { locale: dateLocale })}
					</span>
				</div>
			)}
		</div>
	);
};
