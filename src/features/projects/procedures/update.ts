import { TRPCError } from '@trpc/server';
import { eq, sql } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { activities } from '@/db/schema/activities';
import { projects } from '@/db/schema/projects';
import { protectedProcedure } from '@/trpc/init';

import { updateProjectSchema } from '../schemas/update-project-schema';
import { getProjectAccess } from '../utils/get-project-access';

export const update = protectedProcedure
	.input(z.object({ id: z.string(), data: updateProjectSchema }))
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [existingProject] = await db
			.select()
			.from(projects)
			.where(eq(projects.id, input.id))
			.limit(1);

		if (!existingProject) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'projects.not_found',
			});
		}

		const permissions = await getProjectAccess({
			projectId: existingProject.id,
			orgId: existingProject.organizationId,
			visibility: existingProject.visibility,
			userId,
		});

		if (!permissions.isProjectAdmin && !permissions.isOrgAdmin) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'common.access_denied',
			});
		}

		const [updatedProject] = await db
			.update(projects)
			.set({
				...input.data,
				updatedAt: sql`now()`,
			})
			.where(eq(projects.id, input.id))
			.returning();

		if (
			input.data.name !== undefined &&
			existingProject.name !== input.data.name
		) {
			await db.insert(activities).values({
				projectId: updatedProject.id,
				authorId: userId,
				entityId: updatedProject.id,
				entityType: 'project',
				action: 'renamed',
				meta: {
					from: existingProject.name,
					to: updatedProject.name,
				},
			});
		}

		if (
			input.data.status !== undefined &&
			existingProject.status !== input.data.status
		) {
			await db.insert(activities).values({
				projectId: updatedProject.id,
				authorId: userId,
				entityId: updatedProject.id,
				entityType: 'project',
				action: 'status',
				meta: {
					from: existingProject.status,
					to: updatedProject.status,
				},
			});
		}

		if (
			input.data.visibility !== undefined &&
			existingProject.visibility !== input.data.visibility
		) {
			await db.insert(activities).values({
				projectId: updatedProject.id,
				authorId: userId,
				entityId: updatedProject.id,
				entityType: 'project',
				action: 'visibility',
				meta: {
					from: existingProject.visibility,
					to: updatedProject.visibility,
				},
			});
		}

		if (
			input.data.archived !== undefined &&
			existingProject.archived !== input.data.archived
		) {
			await db.insert(activities).values({
				projectId: updatedProject.id,
				authorId: userId,
				entityId: updatedProject.id,
				entityType: 'project',
				action: 'archived',
				meta: {
					from: existingProject.archived,
					to: updatedProject.archived,
				},
			});
		}

		return updatedProject;
	});
