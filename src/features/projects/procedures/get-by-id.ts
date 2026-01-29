import { TRPCError } from '@trpc/server';
import { and, eq, getTableColumns, lt, sql } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { projects } from '@/db/schema/projects';
import { tasks } from '@/db/schema/tasks';
import { protectedProcedure } from '@/trpc/init';

import { getProjectAccess } from '../utils/get-project-access';

export const getById = protectedProcedure
	.input(z.object({ id: z.string() }))
	.query(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [project] = await db
			.select({
				...getTableColumns(projects),
				tasks: {
					total: db.$count(tasks, eq(tasks.projectId, projects.id)),
					pending: db.$count(
						tasks,
						and(eq(tasks.projectId, projects.id), eq(tasks.status, 'pending')),
					),
					in_progress: db.$count(
						tasks,
						and(
							eq(tasks.projectId, projects.id),
							eq(tasks.status, 'in_progress'),
						),
					),
					in_review: db.$count(
						tasks,
						and(
							eq(tasks.projectId, projects.id),
							eq(tasks.status, 'in_review'),
						),
					),
					completed: db.$count(
						tasks,
						and(
							eq(tasks.projectId, projects.id),
							eq(tasks.status, 'completed'),
						),
					),
					cancelled: db.$count(
						tasks,
						and(
							eq(tasks.projectId, projects.id),
							eq(tasks.status, 'cancelled'),
						),
					),
					overdue: db.$count(
						tasks,
						and(
							eq(tasks.projectId, projects.id),
							eq(tasks.status, 'in_progress'),
							lt(tasks.dueDate, sql`now()`),
						),
					),
				},
			})
			.from(projects)
			.where(eq(projects.id, input.id))
			.limit(1);

		if (!project) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'projects.not_found',
			});
		}

		const permissions = await getProjectAccess({
			projectId: project.id,
			orgId: project.organizationId,
			visibility: project.visibility,
			userId,
		});

		return {
			...project,
			permissions,
		};
	});
