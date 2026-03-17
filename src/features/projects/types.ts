import type { inferRouterOutputs } from '@trpc/server';

import type { ProjectMemberSelectSchema } from '@/db/schema/project-members';
import type { AppRouter } from '@/trpc/routers/_app';

export type ProjectMemberDTO = {
	userId: string;
	role: 'admin' | 'member';
	name: string;
	email: string;
	image?: string | null;
	phone?: string | null;
};

export type ProjectsByOrg =
	inferRouterOutputs<AppRouter>['projects']['getByUser'][number];

export type ProjectById = inferRouterOutputs<AppRouter>['projects']['getById'];

export type ProjectPermissions =
	inferRouterOutputs<AppRouter>['projects']['getById']['permissions'];

export type ProjectStatusType =
	inferRouterOutputs<AppRouter>['projects']['getById']['status'];

export type ProjectVisibilityType =
	inferRouterOutputs<AppRouter>['projects']['getById']['visibility'];

export type Project =
	inferRouterOutputs<AppRouter>['projects']['getByOrganization']['projects'][number];

export type ProjectMember = ProjectMemberSelectSchema & {
	name: string;
	email: string;
	image?: string | null;
	phone?: string | null;
};
