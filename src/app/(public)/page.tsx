import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { HomeView } from '@/features/home/ui/views/home-view';
import { auth } from '@/lib/auth/auth';

const Page = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (session?.user) {
		redirect('/user');
	}

	return <HomeView />;
};

export default Page;
