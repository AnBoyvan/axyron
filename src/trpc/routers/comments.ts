import { create } from '@/features/comments/procedures/create';
import { getByTask } from '@/features/comments/procedures/get-by-task';
import { remove } from '@/features/comments/procedures/remove';
import { setReaction } from '@/features/comments/procedures/set-reaction';
import { update } from '@/features/comments/procedures/update';

import { createTRPCRouter } from '../init';
//TODO:
export const commentsRouter = createTRPCRouter({
	// create,
	// update,
	// remove,
	// getByTask,
	// setReaction,
});
