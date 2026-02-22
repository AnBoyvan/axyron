import z from 'zod';

export const createTaskSchema = z.object({
	title: z.string().min(1, 'tasks.title_required').max(255),
	description: z.string().optional(),
	priority: z.enum(['low', 'medium', 'high', 'critical']),
	startDate: z.date().optional().nullable(),
	dueDate: z.date().optional().nullable(),
	needReview: z.boolean(),
	assigneeIds: z.array(z.string()).optional(),
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
