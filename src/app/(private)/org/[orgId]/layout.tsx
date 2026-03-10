import { Suspense } from 'react';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import {
	OrgSidebar,
	OrgSidebarSkeleton,
} from '@/features/organizations/ui/components/org-sidebar';
import { UserNavbar } from '@/features/users/ui/components/user-navbar';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';

interface OrgLayoutProps {
	children: React.ReactNode;
	params: Promise<{ orgId: string }>;
}

const OrgLayout = async ({ children, params }: OrgLayoutProps) => {
	const { orgId } = await params;

	prefetch(trpc.organizations.getById.queryOptions({ id: orgId }));
	prefetch(trpc.organizations.getMany.queryOptions());

	return (
		<HydrateClient>
			<SidebarProvider>
				<CustomErrorBoundary fallback={'orgs.failed_load_one'}>
					<Suspense fallback={<OrgSidebarSkeleton orgId={orgId} />}>
						<OrgSidebar orgId={orgId} />
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

export default OrgLayout;
