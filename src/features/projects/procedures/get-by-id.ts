import { and, count, eq, lt, sql } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { projectMembers } from '@/db/schema/project-members';
import { tasks } from '@/db/schema/tasks';
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
				total: db.$count(tasks, eq(tasks.projectId, project.id)),
				pending: db.$count(
					tasks,
					and(eq(tasks.projectId, project.id), eq(tasks.status, 'pending')),
				),
				in_progress: db.$count(
					tasks,
					and(eq(tasks.projectId, project.id), eq(tasks.status, 'in_progress')),
				),
				in_review: db.$count(
					tasks,
					and(eq(tasks.projectId, project.id), eq(tasks.status, 'in_review')),
				),
				completed: db.$count(
					tasks,
					and(eq(tasks.projectId, project.id), eq(tasks.status, 'completed')),
				),
				cancelled: db.$count(
					tasks,
					and(eq(tasks.projectId, project.id), eq(tasks.status, 'cancelled')),
				),
				overdue: db.$count(
					tasks,
					and(
						eq(tasks.projectId, project.id),
						eq(tasks.status, 'in_progress'),
						lt(tasks.dueDate, sql`now()`),
					),
				),
			})
			.from(tasks)
			.where(eq(tasks.projectId, project.id))
			.limit(1);

		const [members] = await db
			.select({ count: count() })
			.from(projectMembers)
			.where(eq(projectMembers.projectId, project.id));

		return {
			...project,
			tasks: taskStats,
			permissions,
			membersCount: members.count,
		};
	});
