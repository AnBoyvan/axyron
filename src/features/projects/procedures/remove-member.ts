import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { activities } from '@/db/schema/activities';
import { assignees } from '@/db/schema/assignees';
import { projectMembers } from '@/db/schema/project-members';
import { tasks } from '@/db/schema/tasks';
import { protectedProcedure } from '@/trpc/init';

import { getProjectAccess } from '../utils/get-project-access';
import { isLastProjectAdmin } from '../utils/is-last-project-admin';

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

		await isLastProjectAdmin({
			userId: input.userId,
			projectId: input.projectId,
		});

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

		const projectTasks = await db
			.select({
				taskId: tasks.id,
			})
			.from(tasks)
			.leftJoin(
				assignees,
				and(eq(assignees.taskId, tasks.id), eq(assignees.userId, input.userId)),
			)
			.where(eq(tasks.projectId, input.projectId));

		await Promise.all(
			projectTasks.map(async ({ taskId }) => {
				await db
					.delete(assignees)
					.where(
						and(
							eq(assignees.taskId, taskId),
							eq(assignees.userId, input.userId),
						),
					);
			}),
		);

		await db.insert(activities).values({
			projectId: input.projectId,
			authorId: userId,
			entityId: removedMember.userId,
			entityType: 'user',
			action: 'deleted',
		});

		return removedMember;
	});
