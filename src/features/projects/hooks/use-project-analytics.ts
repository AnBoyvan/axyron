import { useSuspenseQuery } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/client';

export const useProjectAnalytics = (projectId: string) => {
	const trpc = useTRPC();

	return useSuspenseQuery(
		trpc.projects.getAnalytics.queryOptions({ projectId }),
	);
};
