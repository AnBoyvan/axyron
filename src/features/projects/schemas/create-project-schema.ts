import { z } from 'zod';

export const createProjectSchema = z.object({
	name: z.string().min(1, { message: 'orgs.name_required' }),
	description: z.string(),
	visibility: z.enum(['private', 'public']),
	organizationId: z.string(),
});

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;
