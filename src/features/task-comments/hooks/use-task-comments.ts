import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/client';

import { DEFAULT_TASK_COMMENTS_LIMIT } from '../constants';

interface useTaskCommentsProps {
	taskId: string;
}

export const useTaskComments = ({ taskId }: useTaskCommentsProps) => {
	const trpc = useTRPC();

	return useSuspenseInfiniteQuery(
		trpc.taskComments.getByTask.infiniteQueryOptions(
			{
				limit: DEFAULT_TASK_COMMENTS_LIMIT,
				taskId,
			},
			{
				getNextPageParam: lastPage => lastPage.nextCursor,
			},
		),
	);
};
