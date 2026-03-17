import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { ProjectsView } from '@/features/users/ui/views/projects-view';
import { auth } from '@/lib/auth/auth';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';

const Page = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect('/sign-in');
	}

	prefetch(trpc.projects.getByUser.queryOptions());

	return (
		<HydrateClient>
			<ProjectsView />
		</HydrateClient>
	);
};

export default Page;
