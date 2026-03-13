import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { OrgSettingsView } from '@/features/organizations/ui/views/org-settings-view';
import { auth } from '@/lib/auth/auth';

interface PageProps {
	params: Promise<{ orgId: string }>;
}

const Page = async ({ params }: PageProps) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect('/sign-in');
	}

	const { orgId } = await params;

	return <OrgSettingsView orgId={orgId} />;
};

export default Page;
