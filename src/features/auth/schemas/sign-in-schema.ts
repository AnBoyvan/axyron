import { z } from 'zod';

export const signInSchema = z.object({
	email: z.email('auth.email_required'),
	password: z.string().min(1, { message: 'auth.password_required' }),
});

export type SignInSchema = z.infer<typeof signInSchema>;
