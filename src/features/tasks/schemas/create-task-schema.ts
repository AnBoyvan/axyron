import z from 'zod';

export const createTaskSchema = z.object({
	title: z.string().min(1, 'tasks.title_required').max(255),
	description: z.string().optional(),
	projectId: z.string(),
	priority: z.enum(['low', 'medium', 'high', 'critical']).default('low'),
	status: z
		.enum(['pending', 'in_progress', 'in_review', 'completed', 'cancelled'])
		.default('pending'),
	startDate: z.iso.datetime().optional(),
	dueDate: z.iso.datetime().optional(),
	needReview: z.boolean().default(false),
	assigneeIds: z.array(z.string()).optional(),
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
