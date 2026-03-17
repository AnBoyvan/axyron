import { useSuspenseQuery } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/client';

export const useProjectsByUser = () => {
	const trpc = useTRPC();

	return useSuspenseQuery(trpc.projects.getByUser.queryOptions());
};
