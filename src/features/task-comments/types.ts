import type { inferRouterOutputs } from '@trpc/server';

import type { AppRouter } from '@/trpc/routers/_app';

export type TaskComment =
	inferRouterOutputs<AppRouter>['taskComments']['getByTask']['items'][number];

export type Reaction = {
	emoji: string;
	count: number;
	userReacted: boolean;
};
