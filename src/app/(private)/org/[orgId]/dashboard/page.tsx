import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { OrgDashboardView } from '@/features/organizations/ui/views/org-dashboard-view';
import { auth } from '@/lib/auth/auth';

interface OPageProps {
	params: Promise<{ orgId: string }>;
}

const Page = async ({ params }: OPageProps) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect('/sign-in');
	}

	const { orgId } = await params;

	return <OrgDashboardView orgId={orgId} />;
};

export default Page;
