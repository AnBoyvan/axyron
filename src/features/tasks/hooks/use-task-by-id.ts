import { useSuspenseQuery } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/client';

export const useTaskById = (taskId: string) => {
	const trpc = useTRPC();

	return useSuspenseQuery(trpc.tasks.getById.queryOptions({ taskId }));
};
