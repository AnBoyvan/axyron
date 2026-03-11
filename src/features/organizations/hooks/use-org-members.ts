import { useSuspenseQuery } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/client';

export const useOrgMembers = (organizationId: string) => {
	const trpc = useTRPC();

	return useSuspenseQuery(
		trpc.organizations.getMembers.queryOptions({ organizationId }),
	);
};
