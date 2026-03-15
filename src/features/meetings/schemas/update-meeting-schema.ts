import z from 'zod';

export const updateMeetingSchema = z.object({
	title: z.string().min(1).max(255).optional(),
	description: z.string().optional().nullable(),
	meetingUrl: z.string().optional().nullable(),
	startTime: z.date().optional(),
	duration: z.number().int().min(1).optional(),
});

export type UpdateMeetingSchema = z.infer<typeof updateMeetingSchema>;
