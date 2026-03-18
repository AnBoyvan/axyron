import { useCallback, useState } from 'react';

import { format, getDay, parse, startOfWeek } from 'date-fns';
import { useLocale } from 'next-intl';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';

import type { Meeting } from '@/features/meetings/types';
import { MeetingPreview } from '@/features/meetings/ui/components/meeting-preview';
import type { Task } from '@/features/tasks/types';
import { TaskPreview } from '@/features/tasks/ui/components/task-preview';
import { fnsLocale } from '@/i18n/config';
import { cn } from '@/lib/utils/cn';

import { useCalendarEvents } from '../hooks/use-calendar-events';
import type { CalendarEvent } from '../types';
import { getEventStyle } from '../utils/get-event-style';
import { CalendarHeader } from './calendar-header';
import { CalendarLegend } from './calendar-legend';

import 'react-big-calendar/lib/css/react-big-calendar.css';

import { DateHeader } from './date-header';
import { EventComponent } from './event-component';
import { MonthHeader } from './month-header';

interface CalendarProps {
	organizationId?: string;
}

export const Calendar = ({ organizationId }: CalendarProps) => {
	const locale = useLocale();
	const dateLocale = fnsLocale[locale];

	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

	const dateFrom = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth(),
		1,
	);
	const dateTo = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth() + 1,
		0,
		23,
		59,
		59,
		999,
	);

	const { events, isLoading } = useCalendarEvents({
		organizationId,
		dateFrom,
		dateTo,
	});

	const localizer = dateFnsLocalizer({
		format,
		parse,
		startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
		getDay,
		locales: { [locale]: dateLocale },
	});

	const handleSelectEvent = useCallback((event: CalendarEvent) => {
		if (event.type === 'task') {
			setSelectedTask(event.resource as Task);
		} else {
			setSelectedMeeting(event.resource as Meeting);
		}
	}, []);

	const eventStyleGetter = useCallback(
		(event: CalendarEvent) => getEventStyle(event),
		[],
	);

	return (
		<>
			{selectedTask && (
				<TaskPreview
					task={selectedTask}
					open={Boolean(selectedTask)}
					onOpenChange={open => !open && setSelectedTask(null)}
				/>
			)}
			{selectedMeeting && (
				<MeetingPreview
					meeting={selectedMeeting}
					open={Boolean(selectedMeeting)}
					onOpenChange={open => !open && setSelectedMeeting(null)}
				/>
			)}
			<div className="flex flex-col gap-4">
				<CalendarHeader
					currentDate={currentDate}
					setCurrentDate={setCurrentDate}
					locale={dateLocale}
				/>
				<CalendarLegend />
				<div
					className={cn(
						'rbc-reset overflow-hidden rounded-lg border border-border bg-background',
						isLoading && 'pointer-events-none opacity-50',
					)}
				>
					<BigCalendar
						localizer={localizer}
						events={events}
						date={currentDate}
						view="month"
						views={['month']}
						onNavigate={setCurrentDate}
						onSelectEvent={handleSelectEvent}
						eventPropGetter={eventStyleGetter}
						culture={locale}
						toolbar={false}
						tooltipAccessor={null}
						style={{ height: 700 }}
						components={{
							month: {
								header: MonthHeader,
								dateHeader: DateHeader,
								event: EventComponent,
							},
						}}
					/>
				</div>
			</div>
		</>
	);
};
