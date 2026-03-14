import { useState } from 'react';

import { addWeeks, format, subWeeks } from 'date-fns';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import type { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { useMeetingsFilters } from '@/features/meetings/hooks/use-meetings-filter';
import { fnsLocale } from '@/i18n/config';
import { getCurrentWeekRange } from '@/lib/utils/get-current-week-range';

export const MeetingsDateFilter = () => {
	const t = useTranslations();
	const locale = useLocale();
	const [filters, setFilters] = useMeetingsFilters();
	const [open, setOpen] = useState(false);

	const goToPrevWeek = () => {
		setFilters({
			dateFrom: subWeeks(filters.dateFrom, 1),
			dateTo: subWeeks(filters.dateTo, 1),
		});
	};

	const goToNextWeek = () => {
		setFilters({
			dateFrom: addWeeks(filters.dateFrom, 1),
			dateTo: addWeeks(filters.dateTo, 1),
		});
	};

	const goToCurrentWeek = () => {
		const { start, end } = getCurrentWeekRange();
		setFilters({ dateFrom: start, dateTo: end });
		setOpen(false);
	};

	const onSelectRange = (range: DateRange | undefined) => {
		if (!range?.from) return;

		const from = new Date(range.from);
		from.setHours(0, 0, 0, 0);

		const to = new Date(range.to ?? range.from);
		to.setHours(23, 59, 59, 999);

		setFilters({ dateFrom: from, dateTo: to });

		if (range.to) setOpen(false);
	};

	const label = `${format(filters.dateFrom, 'd MMM', { locale: fnsLocale[locale] })} – ${format(filters.dateTo, 'd MMM yyyy', { locale: fnsLocale[locale] })}`;

	return (
		<div className="flex w-full items-center gap-2">
			<Button variant="outline" size="icon" onClick={goToPrevWeek}>
				<ChevronLeftIcon />
			</Button>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						className="min-w-40 flex-1 text-sm md:flex-initial"
					>
						<CalendarIcon className="shrink-0" />
						{label}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						mode="range"
						locale={fnsLocale[locale]}
						selected={{
							from: filters.dateFrom,
							to: filters.dateTo,
						}}
						onSelect={onSelectRange}
					/>
					<div className="border-t p-2">
						<Button
							variant="outline"
							size="sm"
							className="w-full"
							onClick={goToCurrentWeek}
						>
							{t('common.current_week')}
						</Button>
					</div>
				</PopoverContent>
			</Popover>
			<Button variant="outline" size="icon" onClick={goToNextWeek}>
				<ChevronRightIcon />
			</Button>
		</div>
	);
};
