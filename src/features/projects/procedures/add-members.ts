import { TRPCError } from '@trpc/server';
import z from 'zod';

import { db } from '@/db';
import { activities } from '@/db/schema/activities';
import { projectMembers } from '@/db/schema/project-members';
import { protectedProcedure } from '@/trpc/init';

import { getProjectAccess } from '../utils/get-project-access';

export const addMembers = protectedProcedure
	.input(z.object({ id: z.string(), userIds: z.array(z.string()) }))
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const permissions = await getProjectAccess({
			projectId: input.id,
			userId,
		});

		if (!permissions.canInvite) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'common.access_denied',
			});
		}

		const newMembers = await db
			.insert(projectMembers)
			.values(
				input.userIds.map(id => ({
					userId: id,
					projectId: input.id,
					role: 'member' as const,
				})),
			)
			.onConflictDoNothing()
			.returning({ userId: projectMembers.userId });

		if (newMembers.length === 0) {
			return { message: 'No new members added', added: 0 };
		}

		await db.insert(activities).values(
			newMembers.map(member => ({
				projectId: input.id,
				authorId: userId,
				entityId: member.userId,
				entityType: 'user' as const,
				action: 'created' as const,
			})),
		);

		return {
			projectId: input.id,
			message: 'Success',
			added: newMembers.length,
		};
	});
