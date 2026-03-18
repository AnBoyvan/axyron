import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { CalendarView } from '@/features/users/ui/views/calendar-view';
import { auth } from '@/lib/auth/auth';

const Page = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect('/sign-in');
	}

	return <CalendarView />;
};

export default Page;
