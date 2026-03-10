import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/client';

import { DEFAULT_ACTIVITIES_LIMIT } from '../constants';

export const useTaskActivities = (taskId: string) => {
	const trpc = useTRPC();

	return useSuspenseInfiniteQuery(
		trpc.activities.getByTask.infiniteQueryOptions(
			{ taskId, limit: DEFAULT_ACTIVITIES_LIMIT },
			{ getNextPageParam: lastPage => lastPage.nextCursor },
		),
	);
};
