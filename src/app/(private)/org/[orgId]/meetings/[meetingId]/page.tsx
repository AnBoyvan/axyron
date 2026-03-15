import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { DEFAULT_MEETING_COMMENTS_LIMIT } from '@/features/meeting-comments/constants';
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
	prefetch(
		trpc.meetingComments.getByMeeting.infiniteQueryOptions({
			meetingId,
			limit: DEFAULT_MEETING_COMMENTS_LIMIT,
		}),
	);

	return (
		<HydrateClient>
			<MeetingView meetingId={meetingId} />
		</HydrateClient>
	);
};

export default Page;
