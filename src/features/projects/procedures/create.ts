import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { activities } from '@/db/schema/activities';
import { organizationMembers } from '@/db/schema/organization-members';
import { organizations } from '@/db/schema/organizations';
import { projectMembers } from '@/db/schema/project-members';
import { projects } from '@/db/schema/projects';
import { checkProjectLimit } from '@/features/billing/utils/check-project-limit';
import { getOrgPermissions } from '@/features/organizations/utils/get-org-permission';
import { protectedProcedure } from '@/trpc/init';

import { createProjectSchema } from '../schemas/create-project-schema';

export const create = protectedProcedure
	.input(z.object({ organizationId: z.string(), data: createProjectSchema }))
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;
		const { organizationId, data } = input;

		const [row] = await db
			.select({
				org: organizations,
				member: organizationMembers,
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

		const permissions = getOrgPermissions({
			org: row.org,
			member: row.member,
		});

		if (!permissions.createProject) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'common.access_denied',
			});
		}

		await checkProjectLimit(organizationId);

		const [createdProject] = await db
			.insert(projects)
			.values({
				name: data.name,
				description: data.description,
				organizationId,
				visibility: data.visibility,
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
			meta: {
				name: createdProject.name,
			},
		});

		return createdProject;
	});
