import { getByProject } from '@/features/activities/procedures/get-by-project';
import { getByTask } from '@/features/activities/procedures/get-by-task';
import { getByUser } from '@/features/activities/procedures/get-by-user';

import { createTRPCRouter } from '../init';

export const activitiesRouter = createTRPCRouter({
	getByUser,
	getByProject,
	getByTask,
});
