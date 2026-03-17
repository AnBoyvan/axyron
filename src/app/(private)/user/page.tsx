import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { ORG_DASHBOARD_TASKS_LIMIT } from '@/features/tasks/constants';
import { DashboardView } from '@/features/users/ui/views/dashboard-view';
import { auth } from '@/lib/auth/auth';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';

const Page = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect('/sign-in');
	}

	prefetch(
		trpc.tasks.getByUser.queryOptions({
			limit: ORG_DASHBOARD_TASKS_LIMIT,
		}),
	);

	return (
		<HydrateClient>
			<DashboardView />
		</HydrateClient>
	);
};

export default Page;
