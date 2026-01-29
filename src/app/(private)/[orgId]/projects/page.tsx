import { PageLayout } from '@/components/shared/page-layout';
import { OrgProjectsView } from '@/features/projects/ui/views/org-projects-view';

interface OrgProjectsPageProps {
	params: Promise<{ orgId: string }>;
}

const OrgProjectsPage = async ({ params }: OrgProjectsPageProps) => {
	const { orgId } = await params;

	return (
		<PageLayout title="common.projects">
			<OrgProjectsView orgId={orgId} />
		</PageLayout>
	);
};

export default OrgProjectsPage;
