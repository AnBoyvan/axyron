import { z } from 'zod';

export const createOrgSchema = z.object({
	name: z.string().min(1, { message: 'orgs.name_required' }),
	description: z.string(),
});

export type CreateOrgSchema = z.infer<typeof createOrgSchema>;
