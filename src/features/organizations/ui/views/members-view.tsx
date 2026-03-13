'use client';

import { Suspense } from 'react';

import { AccessDenied } from '@/components/shared/access-denied';
import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';
import { ViewWrapper } from '@/components/shared/view-wrapper';

import { useOrgById } from '../../hooks/use-org-by-id';
import {
	MembersSection,
	MembersSectionSkeleton,
} from '../sections/members-section';

interface MembersViewProps {
	orgId: string;
}

export const MembersView = ({ orgId }: MembersViewProps) => {
	const { data } = useOrgById(orgId);

	if (!data.permissions.isAdmin) {
		return (
			<ViewWrapper className="items-center justify-center">
				<AccessDenied />
			</ViewWrapper>
		);
	}

	return (
		<ViewWrapper>
			<CustomErrorBoundary>
				<Suspense fallback={<MembersSectionSkeleton />}>
					<MembersSection orgId={orgId} />
				</Suspense>
			</CustomErrorBoundary>
		</ViewWrapper>
	);
};
