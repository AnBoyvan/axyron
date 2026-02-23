import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { ProjectOverviewView } from '@/features/projects/ui/views/project-overview-view';
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

	prefetch(trpc.projects.getById.queryOptions({ id: projectId }));

	return (
		<HydrateClient>
			<ProjectOverviewView projectId={projectId} />
		</HydrateClient>
	);
};

export default Page;
