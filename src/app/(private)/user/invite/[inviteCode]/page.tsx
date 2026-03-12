import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { InviteView } from '@/features/users/ui/views/invite-view';
import { auth } from '@/lib/auth/auth';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';

interface PageProps {
	params: Promise<{ inviteCode: string }>;
}

const Page = async ({ params }: PageProps) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect('/sign-in');
	}

	const { inviteCode } = await params;

	prefetch(trpc.organizations.getByInviteCode.queryOptions({ inviteCode }));

	return (
		<HydrateClient>
			<InviteView inviteCode={inviteCode} />
		</HydrateClient>
	);
};

export default Page;
