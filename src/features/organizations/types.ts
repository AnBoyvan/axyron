import type { inferRouterOutputs } from '@trpc/server';

import type { AppRouter } from '@/trpc/routers/_app';

export type Organization =
	inferRouterOutputs<AppRouter>['organizations']['getMany'][number];

	export type OrgMember = inferRouterOutputs<AppRouter>['organizations']['getMembers'][number]
