import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { assignees } from '@/db/schema/assignees';
import { organizationMembers } from '@/db/schema/organization-members';
import { organizations } from '@/db/schema/organizations';
import { projectMembers } from '@/db/schema/project-members';
import { projects } from '@/db/schema/projects';
import { tasks } from '@/db/schema/tasks';
import { protectedProcedure } from '@/trpc/init';

export const leave = protectedProcedure
	.input(z.object({ organizationId: z.string() }))
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [org] = await db
			.select({
				memberRole: organizationMembers.role,
				orgName: organizations.name,
			})
			.from(organizations)
			.innerJoin(
				organizationMembers,
				and(
					eq(organizationMembers.organizationId, organizations.id),
					eq(organizationMembers.userId, userId),
				),
			)
			.where(eq(organizations.id, input.organizationId))
			.limit(1);

		if (!org) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'orgs.not_found',
			});
		}

		if (org.memberRole === 'admin') {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'members.admin_cannot_leave',
			});
		}

		await db
			.delete(organizationMembers)
			.where(
				and(
					eq(organizationMembers.userId, userId),
					eq(organizationMembers.organizationId, input.organizationId),
				),
			);

		const orgProjects = await db
			.select({
				projectId: projects.id,
			})
			.from(projects)
			.leftJoin(
				projectMembers,
				and(
					eq(projectMembers.projectId, projects.id),
					eq(projectMembers.userId, userId),
				),
			)
			.where(eq(projects.organizationId, input.organizationId));

		const orgTasks = await db
			.select({
				taskId: tasks.id,
			})
			.from(tasks)
			.leftJoin(
				assignees,
				and(eq(assignees.taskId, tasks.id), eq(assignees.userId, userId)),
			)
			.where(eq(tasks.organizationId, input.organizationId));

		await Promise.all([
			...orgProjects.map(async ({ projectId }) => {
				await db
					.delete(projectMembers)
					.where(
						and(
							eq(projectMembers.projectId, projectId),
							eq(projectMembers.userId, userId),
						),
					);
			}),
			...orgTasks.map(async ({ taskId }) => {
				await db
					.delete(assignees)
					.where(
						and(eq(assignees.taskId, taskId), eq(assignees.userId, userId)),
					);
			}),
		]);

		return {
			organizationId: input.organizationId,
			organizationName: org.orgName,
		};
	});
