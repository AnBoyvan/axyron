import { useSuspenseQuery } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/client';

export const useOrgById = (orgId: string) => {
	const trpc = useTRPC();

	return useSuspenseQuery(
		trpc.organizations.getById.queryOptions({ id: orgId }),
	);
};
