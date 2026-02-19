import { eq } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { projectMembers } from '@/db/schema/project-members';
import { user } from '@/db/schema/user';
import { protectedProcedure } from '@/trpc/init';

import { getProjectAccess } from '../utils/get-project-access';

export const getMembers = protectedProcedure
	.input(z.object({ projectId: z.string() }))
	.query(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		await getProjectAccess({
			projectId: input.projectId,
			userId,
		});

		const members = await db
			.select({
				role: projectMembers.role,
				name: user.name,
				image: user.image,
				email: user.email,
				phone: user.phone,
				userId: user.id,
				projectId: projectMembers.projectId,
			})
			.from(projectMembers)
			.innerJoin(user, eq(user.id, projectMembers.userId))
			.where(eq(projectMembers.projectId, input.projectId));

		return members;
	});
