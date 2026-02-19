'use client';

import { useState } from 'react';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';

import {
	OrgProjectsHeader,
	OrgProjectsHeaderSkeleton,
} from '../components/org-projects-header';
import { OrgProjectsList } from '../components/org-projects-list';

interface OrgProjectsViewProps {
	orgId: string;
}

export const OrgProjectsView = ({ orgId }: OrgProjectsViewProps) => {
	const [search, setSearch] = useState('');

	return (
		<div className="flex flex-col gap-4 lg:gap-8">
			<CustomErrorBoundary fallback={<OrgProjectsHeaderSkeleton />}>
				<OrgProjectsHeader
					orgId={orgId}
					search={search}
					setSearch={setSearch}
				/>
			</CustomErrorBoundary>
			<CustomErrorBoundary fallback={<div>loading...</div>}>
				<OrgProjectsList orgId={orgId} search={search} />
			</CustomErrorBoundary>
		</div>
	);
};
