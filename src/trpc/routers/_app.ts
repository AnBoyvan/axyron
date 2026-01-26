import { createTRPCRouter } from '../init';
import { organizationsRouter } from './organizations';

export const appRouter = createTRPCRouter({
	organizations: organizationsRouter,
});

export type AppRouter = typeof appRouter;
