import type { inferRouterOutputs } from '@trpc/server';

import type { AppRouter } from '@/trpc/routers/_app';

export type Meeting = inferRouterOutputs<AppRouter>['meetings']['getById'];

export type Attendee = Meeting['members'][number];

export type AttendeeStatus = 'accepted' | 'pending' | 'rejected';
