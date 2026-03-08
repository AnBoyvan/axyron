import z from 'zod';

import { MAX_COMMENT_SIZE } from '../constants';

export const updateTaskCommentSchema = z.object({
	commentId: z.string(),
	content: z
		.string()
		.min(1, 'common.comment_placeholder')
		.max(MAX_COMMENT_SIZE),
});

export type UpdateTaskCommentSchema = z.infer<typeof updateTaskCommentSchema>;
