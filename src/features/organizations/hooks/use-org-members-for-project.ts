import { useQuery } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/client';

export const useOrgMembersForProject = (organizationId: string) => {
	const trpc = useTRPC();

	return useQuery(
		trpc.organizations.getMembers.queryOptions({ organizationId }),
	);
};
