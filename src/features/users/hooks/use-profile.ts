import { useSuspenseQuery } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/client';

export const useProfile = () => {
	const trpc = useTRPC();

	return useSuspenseQuery(trpc.user.getProfile.queryOptions());
};
