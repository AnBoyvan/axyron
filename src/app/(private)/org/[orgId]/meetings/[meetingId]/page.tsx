import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { MeetingView } from '@/features/meetings/ui/views/meeting-view';
import { auth } from '@/lib/auth/auth';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';

interface PageProps {
	params: Promise<{ meetingId: string }>;
}

const Page = async ({ params }: PageProps) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect('/sign-in');
	}

	const { meetingId } = await params;

	prefetch(trpc.meetings.getById.queryOptions({ meetingId }));
	prefetch(trpc.meetingComments.getByMeeting.queryOptions({ meetingId }));

	return (
		<HydrateClient>
			<MeetingView meetingId={meetingId} />
		</HydrateClient>
	);
};

export default Page;
