'use client';

import { Suspense } from 'react';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';
import { ViewWrapper } from '@/components/shared/view-wrapper';

import {
	DashboardUserTasksSection,
	DashboardUserTasksSectionSkeleton,
} from '../sections/dashboard-user-tasks-section';
import {
	OrgInfoSection,
	OrgInfoSectionSkeleton,
} from '../sections/org-info-section';
import {
	TodayMeetingsSection,
	TodayMeetingsSectionSkeleton,
} from '../sections/today-meetings-section';

interface DashboardViewProps {
	orgId: string;
}

export const DashboardView = ({ orgId }: DashboardViewProps) => {
	return (
		<ViewWrapper>
			<CustomErrorBoundary>
				<Suspense fallback={<OrgInfoSectionSkeleton />}>
					<OrgInfoSection orgId={orgId} />
				</Suspense>
			</CustomErrorBoundary>
			<div className="mt-4 grid grid-cols-1 gap-4 lg:mt-8 lg:grid-cols-3 lg:gap-8">
				<CustomErrorBoundary>
					<Suspense fallback={<DashboardUserTasksSectionSkeleton />}>
						<DashboardUserTasksSection orgId={orgId} />
					</Suspense>
				</CustomErrorBoundary>
				<CustomErrorBoundary>
					<Suspense fallback={<TodayMeetingsSectionSkeleton />}>
						<TodayMeetingsSection orgId={orgId} />
					</Suspense>
				</CustomErrorBoundary>
			</div>
		</ViewWrapper>
	);
};
