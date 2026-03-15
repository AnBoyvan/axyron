import z from 'zod';

import { MAX_MEETING_COMMENT_SIZE } from '../constants';

export const updateMeetingCommentSchema = z.object({
	commentId: z.string(),
	content: z
		.string()
		.min(1, 'common.comment_placeholder')
		.max(MAX_MEETING_COMMENT_SIZE),
});

export type UpdateMeetingCommentSchema = z.infer<
	typeof updateMeetingCommentSchema
>;
