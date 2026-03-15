import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/client';

import { DEFAULT_MEETING_COMMENTS_LIMIT } from '../constants';

export const useMeetingComments = ({ meetingId }: { meetingId: string }) => {
	const trpc = useTRPC();
	return useSuspenseInfiniteQuery(
		trpc.meetingComments.getByMeeting.infiniteQueryOptions(
			{ meetingId, limit: DEFAULT_MEETING_COMMENTS_LIMIT },
			{ getNextPageParam: lastPage => lastPage.nextCursor },
		),
	);
};
