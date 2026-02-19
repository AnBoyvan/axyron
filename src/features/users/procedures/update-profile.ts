import { eq, sql } from 'drizzle-orm';

import { db } from '@/db';
import { user } from '@/db/schema/user';
import { protectedProcedure } from '@/trpc/init';

import { updateProfileSchema } from '../schemas/update-profile-schema';

export const updateProfile = protectedProcedure
	.input(updateProfileSchema)
	.mutation(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [updated] = await db
			.update(user)
			.set({
				...input,
				updatedAt: sql`now()`,
			})
			.where(eq(user.id, userId))
			.returning({
				id: user.id,
				name: user.name,
				phone: user.phone,
				position: user.position,
				email: user.email,
				image: user.image,
			});

		return updated;
	});
