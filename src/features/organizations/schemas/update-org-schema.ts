import { z } from 'zod';

export const updateOrgSchema = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
	image: z.string().optional(),
});

export type UpdateOrgSchema = z.infer<typeof updateOrgSchema>;
