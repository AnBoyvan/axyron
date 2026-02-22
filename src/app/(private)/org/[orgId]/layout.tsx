import { Suspense } from 'react';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';
import { Separator } from '@/components/ui/separator';
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
				<Suspense fallback={<OrgSidebarSkeleton orgId={orgId} />}>
					<CustomErrorBoundary fallback={'orgs.failed_load_one'}>
						<OrgSidebar orgId={orgId} />
					</CustomErrorBoundary>
				</Suspense>
				<SidebarInset className="">
					{/* <div className="flex h-screen flex-1 flex-col overflow-hidden"> */}
					<UserNavbar />
					<Separator />
					<div className="flex flex-1 flex-col p-4 lg:p-8">{children}</div>
					{/* </div> */}
				</SidebarInset>
			</SidebarProvider>
		</HydrateClient>
	);
};

export default OrgLayout;
