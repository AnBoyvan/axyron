'use client';

import { Suspense } from 'react';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';
import { ViewWrapper } from '@/components/shared/view-wrapper';

import {
	ProjectAnalyticsSection,
	ProjectAnalyticsSectionSkeleton,
} from '../sections/project-analytics-section';

interface ProjectOverviewViewProps {
	projectId: string;
}

export const ProjectAnalyticsView = ({
	projectId,
}: ProjectOverviewViewProps) => {
	return (
		<ViewWrapper>
			<CustomErrorBoundary>
				<Suspense fallback={<ProjectAnalyticsSectionSkeleton />}>
					<ProjectAnalyticsSection projectId={projectId} />
				</Suspense>
			</CustomErrorBoundary>
		</ViewWrapper>
	);
};
