'use client';

import { Suspense } from 'react';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';

import {
	ProjectOverviewSection,
	ProjectOverviewSectionSkeleton,
} from '../sections/project-overview-section';

interface ProjectOverviewViewProps {
	projectId: string;
}

export const ProjectOverviewView = ({
	projectId,
}: ProjectOverviewViewProps) => {
	return (
		<Suspense fallback={<ProjectOverviewSectionSkeleton />}>
			<CustomErrorBoundary>
				<ProjectOverviewSection projectId={projectId} />
			</CustomErrorBoundary>
		</Suspense>
	);
};
