import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { DashboardView } from '@/features/organizations/ui/views/dashboard-view';
import { ORG_DASHBOARD_TASKS_LIMIT } from '@/features/tasks/constants';
import { auth } from '@/lib/auth/auth';
import { getCurrentDayRange } from '@/lib/utils/get-current-day-range';
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
	const { start: dateFrom, end: dateTo } = getCurrentDayRange();

	prefetch(
		trpc.organizations.getMembers.queryOptions({ organizationId: orgId }),
	);
	prefetch(
		trpc.tasks.getByUser.queryOptions({
			organizationId: orgId,
			limit: ORG_DASHBOARD_TASKS_LIMIT,
		}),
	);
	prefetch(
		trpc.meetings.getByOrganization.queryOptions({
			organizationId: orgId,
			dateFrom,
			dateTo,
		}),
	);

	return (
		<HydrateClient>
			<DashboardView orgId={orgId} />
		</HydrateClient>
	);
};

export default Page;
