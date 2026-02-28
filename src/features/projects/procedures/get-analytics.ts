import { eq, getTableColumns, inArray } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { assignees } from '@/db/schema/assignees';
import { projectMembers } from '@/db/schema/project-members';
import { tasks } from '@/db/schema/tasks';
import { user } from '@/db/schema/user';
import { protectedProcedure } from '@/trpc/init';

import { getProjectAccess } from '../../projects/utils/get-project-access';
import { getAnalyticsByMembers } from '../utils/get-analytics-by-members';
import { getAnalyticsByPriority } from '../utils/get-analytics-by-priority';
import { getAnalyticsByStatus } from '../utils/get-analytics-by-status';

export const getAnalytics = protectedProcedure
	.input(z.object({ projectId: z.string() }))
	.query(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const { project, ...permissions } = await getProjectAccess({
			projectId: input.projectId,
			userId,
		});

		const allTasks = await db
			.select()
			.from(tasks)
			.where(eq(tasks.projectId, input.projectId));

		const allTaskIds = allTasks.map(({ id }) => id);

		const allAssignees =
			allTaskIds.length > 0
				? await db
						.select({
							...getTableColumns(assignees),
							name: user.name,
							image: user.image,
						})
						.from(assignees)
						.innerJoin(user, eq(user.id, assignees.userId))
						.where(inArray(assignees.taskId, allTaskIds))
				: [];

		const allMembers = await db
			.select({
				...getTableColumns(projectMembers),
				name: user.name,
				image: user.image,
				email: user.email,
				phone: user.phone,
			})
			.from(projectMembers)
			.innerJoin(user, eq(user.id, projectMembers.userId))
			.where(eq(projectMembers.projectId, input.projectId));

		const byStatus = getAnalyticsByStatus({
			tasks: allTasks,
			assignees: allAssignees,
		});

		const byPriority = getAnalyticsByPriority({
			tasks: allTasks,
			assignees: allAssignees,
		});

		const byMembers = getAnalyticsByMembers({
			tasks: allTasks,
			assignees: allAssignees,
			members: allMembers,
		});

		return {
			project,
			permissions,
			byStatus,
			byPriority,
			byMembers,
		};
	});
