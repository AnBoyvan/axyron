import { eq, sql } from 'drizzle-orm';

import { db } from '@/db';
import { user } from '@/db/schema/user';
import { deleteFile } from '@/lib/r2/delete-file';
import { protectedProcedure } from '@/trpc/init';

export const removeImage = protectedProcedure.mutation(async ({ ctx }) => {
	const userId = ctx.auth.user.id;

	await deleteFile(`users/${userId}`).catch(() => null);

	const [updated] = await db
		.update(user)
		.set({ image: null, updatedAt: sql`now()` })
		.where(eq(user.id, userId))
		.returning();

	return updated;
});
