'use client';

import { ViewWrapper } from '@/components/shared/view-wrapper';
import { Calendar } from '@/features/calendar/components/calendar';

interface CalendarViewProps {
	orgId?: string;
}

export const CalendarView = ({ orgId }: CalendarViewProps) => {
	return (
		<ViewWrapper>
			<Calendar organizationId={orgId} />
		</ViewWrapper>
	);
};
