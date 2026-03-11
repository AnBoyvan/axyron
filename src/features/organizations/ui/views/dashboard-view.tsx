'use client';

import { Suspense } from 'react';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';
import { ViewWrapper } from '@/components/shared/view-wrapper';

import { OrgInfoSection } from '../sections/org-info-section';

interface DashboardViewProps {
	orgId: string;
}

export const DashboardView = ({ orgId }: DashboardViewProps) => {
	return (
		<ViewWrapper>
			<CustomErrorBoundary>
				<Suspense fallback={<div />}>
					<OrgInfoSection orgId={orgId} />
				</Suspense>
			</CustomErrorBoundary>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
				<div className="col-span-1 lg:col-span-2"></div>
				<div className="col-span-1"></div>
			</div>
		</ViewWrapper>
	);
};
