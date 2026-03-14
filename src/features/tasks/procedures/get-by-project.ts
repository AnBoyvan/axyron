import { eq } from 'drizzle-orm';
import z from 'zod';

import { tasks } from '@/db/schema/tasks';
import { getProjectAccess } from '@/features/projects/utils/get-project-access';
import { protectedProcedure } from '@/trpc/init';

import { getTasksQuery } from '../utils/get-tasks-by-query';
import { mapTask } from '../utils/map-tasks';

export const getByProject = protectedProcedure
	.input(z.object({ projectId: z.string() }))
	.query(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const permissions = await getProjectAccess({
			projectId: input.projectId,
			userId,
		});

		const { project, organization, ...rest } = permissions;

		const projectTasks = await getTasksQuery({
			conditions: [eq(tasks.projectId, input.projectId)],
		});

		return {
			tasks: projectTasks.map(row => {
				return mapTask(row, permissions, userId);
			}),
			project,
			permissions: rest,
		};
	});
