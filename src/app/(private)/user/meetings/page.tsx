import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { MeetingsView } from '@/features/users/ui/views/meetings-view';
import { auth } from '@/lib/auth/auth';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';

interface PageProps {
	searchParams: Promise<{
		dateFrom?: string;
		dateTo?: string;
	}>;
}

const Page = async ({ searchParams }: PageProps) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect('/sign-in');
	}

	const { dateFrom, dateTo } = await searchParams;

	prefetch(
		trpc.meetings.getByUser.queryOptions({
			dateFrom,
			dateTo,
		}),
	);

	return (
		<HydrateClient>
			<MeetingsView />
		</HydrateClient>
	);
};

export default Page;
