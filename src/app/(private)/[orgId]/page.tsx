import { SidebarTrigger } from '@/components/ui/sidebar';
import { OrgAvatar } from '@/features/organizations/ui/components/org-avatar';

const OrgDashboardPage = () => {
	return (
		<div className="p-8">
			<SidebarTrigger />
			{/* <div className="space-y-4 p-8">
				<OrgAvatar size="xs" name="c" />
				<OrgAvatar size="sm" name="c" />

				<OrgAvatar name="c" />

				<OrgAvatar size="lg" name="c" />

				<OrgAvatar size="xl" name="c" />
			</div> */}
		</div>
	);
};

export default OrgDashboardPage;
