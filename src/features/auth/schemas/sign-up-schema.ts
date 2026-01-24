import { z } from 'zod';

export const signUpSchema = z
	.object({
		name: z.string().min(1, { message: 'auth.name_required' }),
		email: z.email('auth.email_required'),
		password: z.string().min(1, { message: 'auth.password_required' }),
		confirmPassword: z.string().min(1, { message: 'auth.confirm_password' }),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'auth.password_dont_match',
		path: ['confirmPassword'],
	});

export type SignUpSchema = z.infer<typeof signUpSchema>;
