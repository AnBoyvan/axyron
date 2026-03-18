import type { Meeting } from '../meetings/types';
import type { Task } from '../tasks/types';

export type CalendarEventType = 'task' | 'meeting';

export type CalendarEvent = {
	id: string;
	title: string;
	start: Date;
	end: Date;
	type: CalendarEventType;
	resource: Task | Meeting;
};
