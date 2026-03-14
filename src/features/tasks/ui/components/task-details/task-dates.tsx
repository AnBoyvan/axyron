import { format } from 'date-fns';
import { CalendarCheck2Icon, CalendarSyncIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { Skeleton } from '@/components/ui/skeleton';
import type { Task } from '@/features/tasks/types';
import { fnsLocale } from '@/i18n/config';
import { cn } from '@/lib/utils/cn';

interface TaskDatesProps {
	startDate: Task['startDate'];
	dueDate: Task['dueDate'];
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

export const TaskDatesSkeleton = () => {
	return (
		<div className="flex gap-8">
			<div className="flex flex-col">
				<div className="flex h-8 items-center">
					<Skeleton className="h-4 w-24" />
				</div>
				<div className="flex h-6 items-center">
					<Skeleton className="h-4 w-32" />
				</div>
			</div>
			<div className="flex flex-col">
				<div className="flex h-8 items-center">
					<Skeleton className="h-4 w-24" />
				</div>
				<div className="flex h-6 items-center">
					<Skeleton className="h-4 w-32" />
				</div>
			</div>
		</div>
	);
};
