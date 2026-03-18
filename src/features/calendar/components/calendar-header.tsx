import type { Dispatch, SetStateAction } from 'react';

import { addMonths, format, type Locale, subMonths } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

interface CalendarHeaderProps {
	currentDate: Date;
	setCurrentDate: Dispatch<SetStateAction<Date>>;
	locale: Locale;
}

export const CalendarHeader = ({
	currentDate,
	setCurrentDate,
	locale,
}: CalendarHeaderProps) => {
	const t = useTranslations();

	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="icon"
					onClick={() => setCurrentDate(d => subMonths(d, 1))}
				>
					<ChevronLeftIcon />
				</Button>
				<span className="min-w-40 text-center font-medium capitalize">
					{format(currentDate, 'LLLL yyyy', { locale })}
				</span>
				<Button
					variant="outline"
					size="icon"
					onClick={() => setCurrentDate(d => addMonths(d, 1))}
				>
					<ChevronRightIcon />
				</Button>
			</div>
			<Button
				variant="outline"
				size="sm"
				onClick={() => setCurrentDate(new Date())}
			>
				{t('common.today')}
			</Button>
		</div>
	);
};
