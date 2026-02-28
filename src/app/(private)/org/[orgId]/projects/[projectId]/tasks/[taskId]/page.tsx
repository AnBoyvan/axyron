import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { Developing } from '@/components/shared/developing';
import { auth } from '@/lib/auth/auth';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';

interface PageProps {
	params: Promise<{ taskId: string }>;
}

const Page = async ({ params }: PageProps) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect('/sign-in');
	}

	const { taskId } = await params;

	// prefetch(trpc.tasks.getByProject.queryOptions({ projectId }));

	return (
		<HydrateClient>
			<Developing />
		</HydrateClient>
	);
};

export default Page;
