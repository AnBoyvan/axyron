import { Suspense } from 'react';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
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
				<SidebarInset>
					<main className="flex h-screen flex-col">{children}</main>
				</SidebarInset>
			</SidebarProvider>
		</HydrateClient>
	);
};

export default UserLayout;
