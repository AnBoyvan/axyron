import { z } from 'zod';

export const updateOrgSchema = z.object({
	name: z.string().min(1, { message: 'orgs.name_required' }),
	description: z.string(),
});

export type UpdateOrgSchema = z.infer<typeof updateOrgSchema>;
