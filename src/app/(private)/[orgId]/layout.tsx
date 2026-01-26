import { SidebarProvider } from '@/components/ui/sidebar';
import { OrgSidebar } from '@/features/organizations/ui/components/org-sidebar';

interface OrgLayoutProps {
	children: React.ReactNode;
}

const OrgLayout = ({ children }: OrgLayoutProps) => {
	return (
		<SidebarProvider>
			<OrgSidebar />
			<main className="flex h-screen w-screen flex-col">{children}</main>
		</SidebarProvider>
	);
};

export default OrgLayout;
