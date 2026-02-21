import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { ProjectTasksView } from '@/features/projects/ui/views/project-tasks-view';
import { auth } from '@/lib/auth/auth';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';

interface PageProps {
	params: Promise<{ projectId: string }>;
}

const Page = async ({ params }: PageProps) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect('/sign-in');
	}

	const { projectId } = await params;

	prefetch(trpc.tasks.getByProject.queryOptions({ projectId }));

	return (
		<HydrateClient>
			<ProjectTasksView projectId={projectId} />
		</HydrateClient>
	);
};

export default Page;
