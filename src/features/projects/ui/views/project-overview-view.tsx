'use client';

import { Suspense } from 'react';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';
import { ViewWrapper } from '@/components/shared/view-wrapper';

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
		<ViewWrapper>
			<CustomErrorBoundary>
				<Suspense fallback={<ProjectOverviewSectionSkeleton />}>
					<ProjectOverviewSection projectId={projectId} />
				</Suspense>
			</CustomErrorBoundary>
		</ViewWrapper>
	);
};
