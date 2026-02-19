import z from 'zod';

export const updateProfileSchema = z.object({
	name: z.string().min(1, 'users.name_required').max(255),
	phone: z.string().max(20).optional().nullable(),
	position: z.string().max(255).optional().nullable(),
});

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
