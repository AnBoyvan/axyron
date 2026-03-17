'use client';

import { Suspense } from 'react';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';
import { ViewWrapper } from '@/components/shared/view-wrapper';

import {
	DashboardTasksSection,
	DashboardTasksSectionSkeleton,
} from '../sections/dashboard-tasks-section';
import {
	TodayMeetingsSection,
	TodayMeetingsSectionSkeleton,
} from '../sections/today-meetings-section';

export const DashboardView = () => {
	return (
		<ViewWrapper>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
				<CustomErrorBoundary>
					<Suspense fallback={<DashboardTasksSectionSkeleton />}>
						<DashboardTasksSection />
					</Suspense>
				</CustomErrorBoundary>
				<CustomErrorBoundary>
					<Suspense fallback={<TodayMeetingsSectionSkeleton />}>
						<TodayMeetingsSection />
					</Suspense>
				</CustomErrorBoundary>
			</div>
		</ViewWrapper>
	);
};
