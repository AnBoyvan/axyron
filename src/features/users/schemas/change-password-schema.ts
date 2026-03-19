import z from 'zod';

export const changePassworgSchema = z
	.object({
		currentPassword: z.string().min(1, 'auth.password_required'),
		newPassword: z
			.string('auth.password_required')
			.min(8, 'auth.password_required'),
		confirmPassword: z
			.string('auth.password_required')
			.min(8, 'auth.password_required'),
	})
	.refine(v => v.newPassword === v.confirmPassword, {
		message: 'auth.password_dont_match',
		path: ['confirmPassword'],
	});

export type ChangePassworgSchema = z.infer<typeof changePassworgSchema>;
