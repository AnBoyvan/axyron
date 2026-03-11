import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { Developing } from '@/components/shared/developing';
import { auth } from '@/lib/auth/auth';

const Page = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect('/user');
	}

	return <Developing />;
};

export default Page;
