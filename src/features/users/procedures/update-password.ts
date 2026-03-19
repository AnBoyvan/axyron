import { z } from 'zod';

import { auth } from '@/lib/auth/auth';
import { protectedProcedure } from '@/trpc/init';

export const updatePassword = protectedProcedure
	.input(
		z.object({
			currentPassword: z.string().min(1),
			newPassword: z.string().min(8),
		}),
	)
	.mutation(async ({ input }) => {
		const result = await auth.api.changePassword({
			body: {
				currentPassword: input.currentPassword,
				newPassword: input.newPassword,
				revokeOtherSessions: false,
			},
		});

		return result.user;
	});
