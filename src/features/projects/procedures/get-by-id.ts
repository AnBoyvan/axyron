import { and, eq, getTableColumns, lt, sql } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { projectMembers } from '@/db/schema/project-members';
import { tasks } from '@/db/schema/tasks';
import { user } from '@/db/schema/user';
import { protectedProcedure } from '@/trpc/init';

import { getProjectAccess } from '../utils/get-project-access';

export const getById = protectedProcedure
	.input(z.object({ id: z.string() }))
	.query(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const { project, ...permissions } = await getProjectAccess({
			projectId: input.id,
			userId,
		});

		const [taskStats] = await db
			.select({
				total: sql<number>`count(*) filter (where ${eq(tasks.projectId, project.id)})`,
				pending: sql<number>`count(*) filter (where ${and(eq(tasks.projectId, project.id), eq(tasks.status, 'pending'))})`,
				in_progress: sql<number>`count(*) filter (where ${and(eq(tasks.projectId, project.id), eq(tasks.status, 'in_progress'))})`,
				in_review: sql<number>`count(*) filter (where ${and(eq(tasks.projectId, project.id), eq(tasks.status, 'in_review'))})`,
				completed: sql<number>`count(*) filter (where ${and(eq(tasks.projectId, project.id), eq(tasks.status, 'completed'))})`,
				cancelled: sql<number>`count(*) filter (where ${and(eq(tasks.projectId, project.id), eq(tasks.status, 'cancelled'))})`,
				overdue: sql<number>`count(*) filter (where ${and(eq(tasks.projectId, project.id), eq(tasks.status, 'in_progress'), lt(tasks.dueDate, sql`now()`))})`,
			})
			.from(tasks)
			.where(eq(tasks.projectId, project.id))
			.limit(1);

		const members = await db
			.select({
				...getTableColumns(projectMembers),
				name: user.name,
				image: user.image,
				email: user.email,
			})
			.from(projectMembers)
			.innerJoin(user, eq(user.id, projectMembers.userId))
			.where(eq(projectMembers.projectId, project.id));

		return {
			...project,
			tasks: taskStats,
			permissions,
			members,
		};
	});
