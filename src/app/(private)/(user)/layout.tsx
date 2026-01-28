import { Suspense } from 'react';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import {
	UserSidebar,
	UserSidebarSuspense,
} from '@/features/user/ui/components/user-sidebar';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';

interface UserLayoutProps {
	children: React.ReactNode;
}

const UserLayout = ({ children }: UserLayoutProps) => {
	prefetch(trpc.organizations.getMany.queryOptions());

	return (
		<HydrateClient>
			<SidebarProvider>
				<Suspense fallback={<UserSidebarSuspense />}>
					<CustomErrorBoundary fallback={'orgs.failed_load_many'}>
						<UserSidebar />
					</CustomErrorBoundary>
				</Suspense>
				<SidebarInset>
					<main className="flex h-screen w-screen flex-col">{children}</main>
				</SidebarInset>
			</SidebarProvider>
		</HydrateClient>
	);
};

export default UserLayout;
