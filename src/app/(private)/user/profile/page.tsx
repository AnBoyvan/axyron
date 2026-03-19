import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { ProfileView } from '@/features/users/ui/views/profile-view';
import { auth } from '@/lib/auth/auth';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';

const Page = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect('/sign-in');
	}

	prefetch(trpc.user.getProfile.queryOptions());

	return (
		<HydrateClient>
			<ProfileView />
		</HydrateClient>
	);
};

export default Page;
