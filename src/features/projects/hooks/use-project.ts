import { useSuspenseQuery } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/client';

export const useProject = (projectId: string) => {
	const trpc = useTRPC();

	return useSuspenseQuery(
		trpc.projects.getById.queryOptions({ id: projectId }),
	);
};
