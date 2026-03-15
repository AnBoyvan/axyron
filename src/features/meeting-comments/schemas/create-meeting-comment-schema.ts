import z from 'zod';

import { MAX_MEETING_COMMENT_SIZE } from '../constants';

export const createMeetingCommentSchema = z.object({
	meetingId: z.string(),
	content: z
		.string()
		.min(1, 'common.comment_placeholder')
		.max(MAX_MEETING_COMMENT_SIZE),
});

export type CreateMeetingCommentSchema = z.infer<
	typeof createMeetingCommentSchema
>;
