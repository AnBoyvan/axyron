import { TRPCError } from '@trpc/server';
import { and, eq, sql } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { activities } from '@/db/schema/activities';
import { projectMembers } from '@/db/schema/project-members';
import { protectedProcedure } from '@/trpc/init';

import { getProjectAccess } from '../utils/get-project-access';
import { isLastProjectAdmin } from '../utils/is-last-project-admin';

export const updateMember = protectedProcedure
	.input(
		z.object({
			projectId: z.string(),
			userId: z.string(),
			role: z.enum(['admin', 'member']).optional(),
			canInvite: z.boolean().optional(),
			canCreateTasks: z.boolean().optional(),
		}),
	)
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const permissions = await getProjectAccess({
			projectId: input.projectId,
			userId,
		});

		if (!permissions.isOrgAdmin && !permissions.isProjectAdmin) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'common.access_denied',
			});
		}

		if (userId === input.userId && !permissions.isOrgAdmin) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'members.cannot_change_own_role',
			});
		}

		if (input.role === 'member') {
			await isLastProjectAdmin({
				userId: input.userId,
				projectId: input.projectId,
			});
		}

		const [updated] = await db
			.update(projectMembers)
			.set({
				role: input.role,
				canInvite: input.canInvite,
				canCreateTask: input.canCreateTasks,
				updatedAt: sql`now()`,
			})
			.where(
				and(
					eq(projectMembers.projectId, input.projectId),
					eq(projectMembers.userId, input.userId),
				),
			)
			.returning();

		if (!updated) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'members.not_found',
			});
		}

		if (input.role) {
			await db.insert(activities).values({
				projectId: input.projectId,
				authorId: userId,
				entityId: updated.userId,
				entityType: 'user',
				action: 'status',
				meta: {
					role: input.role,
				},
			});
		}

		return updated;
	});
