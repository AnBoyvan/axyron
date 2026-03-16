import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { OrgTasksView } from '@/features/organizations/ui/views/org-tasks-view';
import { auth } from '@/lib/auth/auth';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';

interface PageProps {
	params: Promise<{ orgId: string }>;
}

const Page = async ({ params }: PageProps) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect('/sign-in');
	}

	const { orgId } = await params;

	prefetch(
		trpc.tasks.getByUser.queryOptions({
			organizationId: orgId,
		}),
	);

	return (
		<HydrateClient>
			<OrgTasksView orgId={orgId} />
		</HydrateClient>
	);
};

export default Page;
