import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { activities } from '@/db/schema/activities';
import { projectMembers } from '@/db/schema/project-members';
import { protectedProcedure } from '@/trpc/init';

import { getProjectAccess } from '../utils/get-project-access';

export const removeMember = protectedProcedure
	.input(z.object({ projectId: z.string(), userId: z.string() }))
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

		const [removedMember] = await db
			.delete(projectMembers)
			.where(
				and(
					eq(projectMembers.userId, input.userId),
					eq(projectMembers.projectId, input.projectId),
				),
			)
			.returning();

		if (!removedMember) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'members.not_found',
			});
		}

		await db.insert(activities).values({
			projectId: input.projectId,
			authorId: userId,
			entityId: removedMember.userId,
			entityType: 'user',
			action: 'deleted',
		});

		return removedMember;
	});
