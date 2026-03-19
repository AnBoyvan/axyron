import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { account } from '@/db/schema/account';
import { user } from '@/db/schema/user';
import { protectedProcedure } from '@/trpc/init';

export const getProfile = protectedProcedure.query(async ({ ctx }) => {
	const userId = ctx.auth.user.id;

	const [passwordAccount] = await db
		.select()
		.from(account)
		.where(eq(account.userId, userId))
		.limit(1);

	const [profile] = await db
		.select({
			id: user.id,
			name: user.name,
			phone: user.phone,
			position: user.position,
			email: user.email,
			emailVerified: user.emailVerified,
			image: user.image,
			createdAt: user.createdAt,
		})
		.from(user)
		.where(eq(user.id, userId))
		.limit(1);

	return {
		...profile,
		hasPassword: passwordAccount?.providerId === 'credential',
	};
});
