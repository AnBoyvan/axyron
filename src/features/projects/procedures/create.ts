import { TRPCError } from '@trpc/server';
import { and, eq, getTableColumns } from 'drizzle-orm';

import { db } from '@/db';
import { activities } from '@/db/schema/activities';
import { organizationMembers } from '@/db/schema/organization-members';
import { organizations } from '@/db/schema/organizations';
import { projectMembers } from '@/db/schema/project-members';
import { projects } from '@/db/schema/projects';
import { protectedProcedure } from '@/trpc/init';

import { createProjectSchema } from '../schemas/create-project-schema';

export const create = protectedProcedure
	.input(createProjectSchema)
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [existingMember] = await db
			.select({
				...getTableColumns(organizationMembers),
				createPermission: organizations.canCreateProject,
			})
			.from(organizationMembers)
			.innerJoin(
				organizations,
				eq(organizations.id, organizationMembers.organizationId),
			)
			.where(
				and(
					eq(organizationMembers.userId, userId),
					eq(organizationMembers.organizationId, input.organizationId),
				),
			)
			.limit(1);

		if (
			!existingMember ||
			existingMember.role !== 'admin' ||
			!existingMember.canCreateProject ||
			!existingMember.createPermission
		) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'common.access_denied',
			});
		}

		const [createdProject] = await db
			.insert(projects)
			.values({
				name: input.name,
				description: input.description,
				organizationId: input.organizationId,
				visibility: input.visibility,
			})
			.returning();

		await db.insert(projectMembers).values({
			userId,
			projectId: createdProject.id,
			role: 'admin',
			canInvite: true,
			canCreateTask: true,
		});

		await db.insert(activities).values({
			projectId: createdProject.id,
			authorId: userId,
			entityId: createdProject.id,
			entityType: 'project',
			action: 'created',
		});

		return createdProject;
	});
