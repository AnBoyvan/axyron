import { z } from 'zod';

export const updateProjectSchema = z.object({
	name: z.string().min(1, { message: 'orgs.name_required' }).optional(),
	description: z.string().optional(),
	visibility: z.enum(['private', 'public']).optional(),
	status: z.enum(['pending', 'active', 'closed']).optional(),
	archived: z.boolean().optional(),
});

export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;
