import z from 'zod';

import { MAX_TASK_COMMENT_SIZE } from '../constants';

export const createTaskCommentSchema = z.object({
	taskId: z.string(),
	content: z
		.string()
		.min(1, 'common.comment_placeholder')
		.max(MAX_TASK_COMMENT_SIZE),
	parentId: z.string().nullish(),
});

export type CreateTaskCommentSchema = z.infer<typeof createTaskCommentSchema>;
