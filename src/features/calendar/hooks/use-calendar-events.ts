import { useMemo } from 'react';

import { addMinutes } from 'date-fns';

import { useMeetingsForCalendar } from '@/features/meetings/hooks/use-meetings-for-calendar';
import { useTasksForCalendar } from '@/features/tasks/hooks/use-tasks-for-calendar';

import type { CalendarEvent } from '../types';

interface UseCalendarEventsParams {
	organizationId?: string;
	dateFrom: Date;
	dateTo: Date;
}

export const useCalendarEvents = ({
	organizationId,
	dateFrom,
	dateTo,
}: UseCalendarEventsParams) => {
	const { data: tasks, isLoading: tasksLoading } = useTasksForCalendar({
		organizationId,
		dateFrom,
		dateTo,
	});

	const { data: meetings, isLoading: meetingsLoading } = useMeetingsForCalendar(
		{
			organizationId,
			dateFrom,
			dateTo,
		},
	);

	const events = useMemo<CalendarEvent[]>(() => {
		const taskEvents: CalendarEvent[] =
			tasks
				?.filter(task => task.startDate || task.dueDate)
				.map(task => ({
					id: `task-${task.id}`,
					title: task.title,
					start: task.startDate ?? task.dueDate!,
					end: task.dueDate ?? task.startDate!,
					type: 'task' as const,
					resource: task,
				})) ?? [];

		const meetingEvents: CalendarEvent[] =
			meetings?.map(meeting => ({
				id: `meeting-${meeting.id}`,
				title: meeting.title,
				start: new Date(meeting.startTime),
				end: addMinutes(new Date(meeting.startTime), meeting.duration),
				type: 'meeting' as const,
				resource: meeting,
			})) ?? [];

		return [...taskEvents, ...meetingEvents];
	}, [tasks, meetings]);

	return {
		events,
		isLoading: tasksLoading || meetingsLoading,
	};
};
