import z from 'zod';

export const createMeetingSchema = z.object({
	title: z.string().min(1).max(255),
	description: z.string().optional(),
	meetingUrl: z.string().optional(),
	startTime: z.date(),
	duration: z.number().int().min(1),
	organizationId: z.string(),
	memberIds: z.array(z.string()),
});

export type CreateMeetingSchema = z.infer<typeof createMeetingSchema>;
