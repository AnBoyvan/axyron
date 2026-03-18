import { useQuery } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/client';

interface UseMeetingsForCalendarProps {
	organizationId?: string;
	dateFrom: Date;
	dateTo: Date;
}

export const useMeetingsForCalendar = ({
	organizationId,
	dateFrom,
	dateTo,
}: UseMeetingsForCalendarProps) => {
	const trpc = useTRPC();

	return useQuery(
		trpc.meetings.getByUser.queryOptions({
			organizationId,
			dateFrom,
			dateTo,
		}),
	);
};
