import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { Developing } from '@/components/shared/developing';
import { auth } from '@/lib/auth/auth';

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

	return <Developing />;
};

export default Page;
