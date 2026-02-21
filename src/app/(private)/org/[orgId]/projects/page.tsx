import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { OrgProjectsView } from '@/features/projects/ui/views/org-projects-view';
import { auth } from '@/lib/auth/auth';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';

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

	prefetch(trpc.organizations.getById.queryOptions({ id: orgId }));
	prefetch(
		trpc.projects.getByOrganization.queryOptions({ organizationId: orgId }),
	);

	return (
		<HydrateClient>
			<OrgProjectsView orgId={orgId} />
		</HydrateClient>
	);
};

export default Page;
