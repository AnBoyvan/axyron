import type { inferRouterOutputs } from '@trpc/server';

import type { AppRouter } from '@/trpc/routers/_app';

export type MeetingComment =
	inferRouterOutputs<AppRouter>['meetingComments']['getByMeeting']['items'][number];

export type MeetingCommentReaction = {
	emoji: string;
	count: number;
	userReacted: boolean;
};
