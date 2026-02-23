'use client';

import { Suspense, useState } from 'react';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';

import {
	OrgProjectsHeader,
	OrgProjectsHeaderSkeleton,
} from '../components/org-projects-header';
import {
	OrgProjectsList,
	OrgProjectsListSkeleton,
} from '../components/org-projects-list';

interface OrgProjectsViewProps {
	orgId: string;
}

export const OrgProjectsView = ({ orgId }: OrgProjectsViewProps) => {
	const [search, setSearch] = useState('');

	return (
		<div className="flex flex-1 flex-col gap-4 lg:gap-8">
			<Suspense fallback={<OrgProjectsHeaderSkeleton />}>
				<CustomErrorBoundary>
					<OrgProjectsHeader
						orgId={orgId}
						search={search}
						setSearch={setSearch}
					/>
				</CustomErrorBoundary>
			</Suspense>
			<Suspense fallback={<OrgProjectsListSkeleton />}>
				<CustomErrorBoundary>
					<OrgProjectsList orgId={orgId} search={search} />
				</CustomErrorBoundary>
			</Suspense>
		</div>
	);
};
