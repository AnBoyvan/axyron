'use client';

import { Suspense } from 'react';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';
import { ViewWrapper } from '@/components/shared/view-wrapper';

import { UserTasksSection } from '../sections/user-tasks-section';

interface OrgTasksViewProps {
	orgId: string;
}

export const OrgTasksView = ({ orgId }: OrgTasksViewProps) => {
	return (
		<ViewWrapper>
			<CustomErrorBoundary>
				<Suspense fallback={<div />}>
					<UserTasksSection orgId={orgId} />
				</Suspense>
			</CustomErrorBoundary>
		</ViewWrapper>
	);
};
