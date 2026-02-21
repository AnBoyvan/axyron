import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { auth } from '@/lib/auth/auth';

const Page = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect('/sign-in');
	}

	return (
		<div className="p-8">
			<SidebarTrigger />
		</div>
	);
};

export default Page;
