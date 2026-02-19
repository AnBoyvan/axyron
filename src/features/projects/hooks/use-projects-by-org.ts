import { useSuspenseQuery } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/client';

export const useProjectsByOrg = (orgId: string) => {
	const trpc = useTRPC();

	return useSuspenseQuery(
		trpc.projects.getByOrganization.queryOptions({ organizationId: orgId }),
	);
};
