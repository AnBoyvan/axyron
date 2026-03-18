import { useQuery } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/client';

interface UseTasksForCalendarProps {
	organizationId?: string;
	dateFrom: Date;
	dateTo: Date;
}

export const useTasksForCalendar = ({
	organizationId,
	dateFrom,
	dateTo,
}: UseTasksForCalendarProps) => {
	const trpc = useTRPC();

	return useQuery(
		trpc.tasks.getForCalendar.queryOptions({
			organizationId,
			dateFrom,
			dateTo,
		}),
	);
};
