import { useSuspenseQuery } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/client';

export const useTasksByProject = (projectId: string) => {
	const trpc = useTRPC();

	return useSuspenseQuery(trpc.tasks.getByProject.queryOptions({ projectId }));
};
