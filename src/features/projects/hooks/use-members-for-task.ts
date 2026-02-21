import { useQuery } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/client';

export const useMembersForTask = (projectId: string) => {
	const trpc = useTRPC();

	return useQuery(trpc.projects.getMembers.queryOptions({ projectId }));
};
