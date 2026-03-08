import { create } from '@/features/task-comments/procedures/create';
import { getByTask } from '@/features/task-comments/procedures/get-by-task';
import { remove } from '@/features/task-comments/procedures/remove';
import { setReaction } from '@/features/task-comments/procedures/set-reaction';
import { update } from '@/features/task-comments/procedures/update';

import { createTRPCRouter } from '../init';

export const taskCommentsRouter = createTRPCRouter({
	create,
	update,
	remove,
	getByTask,
	setReaction,
});
