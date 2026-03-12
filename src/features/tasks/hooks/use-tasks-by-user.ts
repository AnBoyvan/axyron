import { useSuspenseQuery } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/client';

interface UseTasksByUserProps {
	orgId?: string;
	userId?: string;
	limit?: number;
}

export const useTasksByUser = ({
	orgId,
	userId,
	limit,
}: UseTasksByUserProps) => {
	const trpc = useTRPC();

	return useSuspenseQuery(
		trpc.tasks.getByUser.queryOptions({ organizationId: orgId, userId, limit }),
	);
};
