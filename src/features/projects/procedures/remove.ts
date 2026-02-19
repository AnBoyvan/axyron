import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { projects } from '@/db/schema/projects';
import { protectedProcedure } from '@/trpc/init';

import { getProjectAccess } from '../utils/get-project-access';

export const remove = protectedProcedure
	.input(z.object({ id: z.string() }))
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const permissions = await getProjectAccess({
			projectId: input.id,
			userId,
		});

		if (!permissions.isProjectAdmin && !permissions.isOrgAdmin) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'common.access_denied',
			});
		}

		const [removedProject] = await db
			.delete(projects)
			.where(eq(projects.id, input.id))
			.returning();

		return removedProject;
	});
