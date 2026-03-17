import { useSuspenseQuery } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/client';

interface UseMeetingsByUserProps {
	dateFrom?: Date;
	dateTo?: Date;
}

export const useMeetingsByUser = ({
	dateFrom,
	dateTo,
}: UseMeetingsByUserProps) => {
	const trpc = useTRPC();

	return useSuspenseQuery(
		trpc.meetings.getByUser.queryOptions({
			dateFrom,
			dateTo,
		}),
	);
};
