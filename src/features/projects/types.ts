import type { inferRouterOutputs } from '@trpc/server';

import type { AppRouter } from '@/trpc/routers/_app';

export type ProjectMemberDTO = {
	userId: string;
	role: 'admin' | 'member';
	name: string;
	image: string | null;
	email: string;
	phone: string | null;
};

export type ProjectById = inferRouterOutputs<AppRouter>['projects']['getById'];

export type Project =
	inferRouterOutputs<AppRouter>['projects']['getByOrganization'][number];
