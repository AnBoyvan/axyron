import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { SignInView } from '@/features/auth/ui/views/sign-in-view';
import { auth } from '@/lib/auth/auth';

const Page = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (session) {
		redirect('/user');
	}

	return <SignInView />;
};

export default Page;
