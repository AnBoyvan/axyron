import { useSuspenseQuery } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/client';

interface UseMeetingsByOrgProps {
	orgId: string;
	dateFrom?: string;
	dateTo?: string;
}

export const useMeetingsByOrg = ({
	orgId,
	dateFrom,
	dateTo,
}: UseMeetingsByOrgProps) => {
	const trpc = useTRPC();

	return useSuspenseQuery(
		trpc.meetings.getByOrganization.queryOptions({
			organizationId: orgId,
			dateFrom,
			dateTo,
		}),
	);
};
