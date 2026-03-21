import { createTRPCRouter } from '../init';
import { activitiesRouter } from './activities';
import { billingRouter } from './billing';
import { meetingCommentsRouter } from './meeting-comments';
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
	taskComments: taskCommentsRouter,
	activities: activitiesRouter,
	meetings: meetingsRouter,
	meetingComments: meetingCommentsRouter,
	billing: billingRouter,
});

export type AppRouter = typeof appRouter;
