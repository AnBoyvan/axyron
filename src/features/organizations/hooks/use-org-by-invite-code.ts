import { useSuspenseQuery } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/client';

export const useOrgByInviteCode = (inviteCode: string) => {
	const trpc = useTRPC();

	return useSuspenseQuery(
		trpc.organizations.getByInviteCode.queryOptions({ inviteCode }),
	);
};
