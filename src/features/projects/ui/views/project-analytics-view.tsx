'use client';

import { Suspense } from 'react';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';

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
		<Suspense fallback={<ProjectAnalyticsSectionSkeleton />}>
			<CustomErrorBoundary>
				<ProjectAnalyticsSection projectId={projectId} />
			</CustomErrorBoundary>
		</Suspense>
	);
};
