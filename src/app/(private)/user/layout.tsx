import { Suspense } from 'react';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { UserNavbar } from '@/features/users/ui/components/user-navbar';
import {
	UserSidebar,
	UserSidebarSkeleton,
} from '@/features/users/ui/components/user-sidebar';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';

interface UserLayoutProps {
	children: React.ReactNode;
}

const UserLayout = ({ children }: UserLayoutProps) => {
	prefetch(trpc.organizations.getMany.queryOptions());

	return (
		<HydrateClient>
			<SidebarProvider>
				<CustomErrorBoundary fallback={'orgs.failed_load_many'}>
					<Suspense fallback={<UserSidebarSkeleton />}>
						<UserSidebar />
					</Suspense>
				</CustomErrorBoundary>
				<SidebarInset className="relative h-svh overflow-hidden">
					<UserNavbar />
					<div className="flex min-w-0 flex-1 flex-col overflow-y-scroll">
						{children}
					</div>
				</SidebarInset>
			</SidebarProvider>
		</HydrateClient>
	);
};

export default UserLayout;
