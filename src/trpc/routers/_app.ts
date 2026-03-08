import { createTRPCRouter } from '../init';
import { activitiesRouter } from './activities';
import { meetingsRouter } from './meetings';
import { organizationsRouter } from './organizations';
import { projectsRouter } from './projects';
import { taskCommentsRouter } from './task-comments';
import { tasksRouter } from './tasks';
import { usersRouter } from './users';

export const appRouter = createTRPCRouter({
	user: usersRouter,
	organizations: organizationsRouter,
	projects: projectsRouter,
	tasks: tasksRouter,
	activities: activitiesRouter,
	taskComments: taskCommentsRouter,
	meetingsRouter,
});

export type AppRouter = typeof appRouter;
