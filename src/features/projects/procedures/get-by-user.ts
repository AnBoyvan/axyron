import { protectedProcedure } from '@/trpc/init';

import { buildProjectsQuery } from '../utils/build-projects-query';

export const getByUser = protectedProcedure.query(async ({ ctx }) => {
	const userId = ctx.auth.user.id;

	const projects = await buildProjectsQuery({
		userId,
		isAdmin: false,
		archived: false,
	});

	const orgs = [
		...new Map(
			projects.map(project => [project.organizationId, project.organization]),
		).values(),
	];

	const orgsWithProjects = orgs.map(org => ({
		...org,
		projects: projects.filter(project => project.organizationId === org.id),
	}));

	return orgsWithProjects;
});
