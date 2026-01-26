import { SidebarProvider } from '@/components/ui/sidebar';
import { UserSidebar } from '@/features/user/ui/components/user-sidebar';

interface UserLayoutProps {
	children: React.ReactNode;
}

const UserLayout = ({ children }: UserLayoutProps) => {
	return (
		<SidebarProvider>
			<UserSidebar />
			<main className="flex h-screen w-screen flex-col">{children}</main>
		</SidebarProvider>
	);
};

export default UserLayout;
