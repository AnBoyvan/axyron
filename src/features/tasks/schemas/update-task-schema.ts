import z from 'zod';

export const updateTaskSchema = z.object({
	title: z.string().min(1).max(255).optional(),
	description: z.string().optional(),
	priority: z.enum(['low', 'medium', 'high', 'critical']).default('low'),
	status: z
		.enum(['pending', 'in_progress', 'in_review', 'completed', 'cancelled'])
		.default('pending'),
	startDate: z.iso.datetime().optional(),
	dueDate: z.iso.datetime().optional(),
	needReview: z.boolean().default(false),
});

export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;
