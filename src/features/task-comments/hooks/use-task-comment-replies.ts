import { useInfiniteQuery } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/client';

import { DEFAULT_TASK_COMMENTS_LIMIT } from '../constants';

interface UseTaskCommentsRepliesProps {
	taskId: string;
	parentId: string;
}

export const useTaskCommentsReplies = ({
	taskId,
	parentId,
}: UseTaskCommentsRepliesProps) => {
	const trpc = useTRPC();

	return useInfiniteQuery(
		trpc.taskComments.getByTask.infiniteQueryOptions(
			{
				limit: DEFAULT_TASK_COMMENTS_LIMIT,
				taskId,
				parentId,
			},
			{
				getNextPageParam: lastPage => lastPage.nextCursor,
			},
		),
	);
};
