import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { DashboardView } from '@/features/organizations/ui/views/dashboard-view';
import { ORG_DASHBOARD_TASKS_LIMIT } from '@/features/tasks/constants';
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
		trpc.organizations.getMembers.queryOptions({ organizationId: orgId }),
	);
	prefetch(
		trpc.tasks.getByUser.queryOptions({
			organizationId: orgId,
			limit: ORG_DASHBOARD_TASKS_LIMIT,
		}),
	);

	return (
		<HydrateClient>
			<DashboardView orgId={orgId} />
		</HydrateClient>
	);
};

export default Page;
