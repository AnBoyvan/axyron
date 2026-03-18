import type { CalendarEvent } from '../types';

export const MEETING_COLOR = 'oklch(60.6% 0.25 292.717)';

export const getEventStyle = (event: CalendarEvent) => {
	if (event.type === 'meeting') {
		return {
			style: {
				backgroundColor: MEETING_COLOR,
				borderColor: MEETING_COLOR,
				color: '#fff',
			},
		};
	}

	return {
		style: {
			backgroundColor: 'transparent',
			border: 'none',
			padding: 0,
		},
	};
};
