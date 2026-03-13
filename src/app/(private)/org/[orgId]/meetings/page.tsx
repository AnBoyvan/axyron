import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { MeetingsView } from '@/features/organizations/ui/views/meetings-view';
import { auth } from '@/lib/auth/auth';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';

interface PageProps {
	params: Promise<{ orgId: string }>;
	searchParams: Promise<{
		dateFrom?: string;
		dateTo?: string;
	}>;
}

const Page = async ({ params, searchParams }: PageProps) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect('/sign-in');
	}

	const { orgId } = await params;
	const { dateFrom, dateTo } = await searchParams;

	prefetch(
		trpc.meetings.getByOrganization.queryOptions({
			organizationId: orgId,
			dateFrom,
			dateTo,
		}),
	);

	return (
		<HydrateClient>
			<MeetingsView orgId={orgId} />
		</HydrateClient>
	);
};

export default Page;
