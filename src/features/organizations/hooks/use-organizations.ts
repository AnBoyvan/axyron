import { useSuspenseQuery } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/client';

export const useOrganizations = () => {
	const trpc = useTRPC();

	return useSuspenseQuery(trpc.organizations.getMany.queryOptions());
};
