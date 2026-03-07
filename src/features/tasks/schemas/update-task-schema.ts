import z from 'zod';

export const updateTaskSchema = z.object({
	title: z.string().min(1).max(255).optional(),
	description: z.string().optional(),
	priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
	status: z
		.enum(['pending', 'in_progress', 'in_review', 'completed', 'cancelled'])
		.optional(),
	startDate: z.date().optional().nullable(),
	dueDate: z.date().optional().nullable(),
	needReview: z.boolean().optional(),
});

export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;
