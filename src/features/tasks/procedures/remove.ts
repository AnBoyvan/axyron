import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { activities } from '@/db/schema/activities';
import { tasks } from '@/db/schema/tasks';
import { getProjectAccess } from '@/features/projects/utils/get-project-access';
import { protectedProcedure } from '@/trpc/init';

export const remove = protectedProcedure
	.input(z.object({ taskId: z.string() }))
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [existingTask] = await db
			.select()
			.from(tasks)
			.where(eq(tasks.id, input.taskId))
			.limit(1);

		if (!existingTask) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'tasks.not_found',
			});
		}

		const { isOrgAdmin, isProjectAdmin } = await getProjectAccess({
			projectId: existingTask.projectId,
			userId,
		});

		if (!isOrgAdmin && !isProjectAdmin) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'common.access_denied',
			});
		}

		await db.delete(tasks).where(eq(tasks.id, input.taskId));

		await db.insert(activities).values({
			projectId: existingTask.projectId,
			authorId: userId,
			entityId: existingTask.id,
			entityType: 'task',
			action: 'deleted',
			meta: {
				title: existingTask.title,
			},
		});

		return { taskId: input.taskId };
	});
