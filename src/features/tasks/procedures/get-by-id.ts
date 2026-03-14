import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import z from 'zod';

import { tasks } from '@/db/schema/tasks';
import { getProjectAccess } from '@/features/projects/utils/get-project-access';
import { protectedProcedure } from '@/trpc/init';

import { getTasksQuery } from '../utils/get-tasks-by-query';
import { mapTask } from '../utils/map-tasks';

export const getById = protectedProcedure
	.input(z.object({ taskId: z.string() }))
	.query(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [task] = await getTasksQuery({
			conditions: [eq(tasks.id, input.taskId)],
			limit: 1,
		});

		if (!task) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'tasks.not_found',
			});
		}

		const permissions = await getProjectAccess({
			projectId: task.projectId,
			userId,
		});

		return mapTask(task, permissions, userId);
	});
