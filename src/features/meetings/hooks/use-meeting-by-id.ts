import { useSuspenseQuery } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/client';

export const useMeetingById = (meetingId: string) => {
	const trpc = useTRPC();

	return useSuspenseQuery(trpc.meetings.getById.queryOptions({ meetingId }));
};
