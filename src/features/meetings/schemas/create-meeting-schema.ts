import z from 'zod';

export const createMeetingSchema = z.object({
	title: z.string().min(1).max(255),
	description: z.string().optional(),
	meetingUrl: z.string().optional(),
	startTime: z.iso.datetime(),
	duration: z.number().int().min(1),
	organizationId: z.string(),
});

export type CreateMeetingSchema = z.infer<typeof createMeetingSchema>;
