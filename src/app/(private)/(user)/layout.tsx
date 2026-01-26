import { Suspense } from 'react';

import { ErrorBoundary } from 'react-error-boundary';

import { ErrorState } from '@/components/shared/error-state';
import { SidebarProvider } from '@/components/ui/sidebar';
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
					<ErrorBoundary
						fallback={
							<ErrorState
								title={'orgs.failed_load_many'}
								description={'common.try_later'}
							/>
						}
					>
						<UserSidebar />
					</ErrorBoundary>
				</Suspense>
				<main className="flex h-screen w-screen flex-col">{children}</main>
			</SidebarProvider>
		</HydrateClient>
	);
};

export default UserLayout;
