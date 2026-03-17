import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { UserTasksView } from '@/features/users/ui/views/user-tasks-view';
import { auth } from '@/lib/auth/auth';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';

const Page = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect('/sign-in');
	}

	prefetch(trpc.tasks.getByUser.queryOptions({}));

	return (
		<HydrateClient>
			<UserTasksView />
		</HydrateClient>
	);
};

export default Page;
