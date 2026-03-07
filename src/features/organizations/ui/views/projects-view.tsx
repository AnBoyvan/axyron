'use client';

import { Suspense } from 'react';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';
import { ViewWrapper } from '@/components/shared/view-wrapper';

import {
	ProjectsSection,
	ProjectsSectionSkeleton,
} from '../sections/projects-section';

interface ProjectsViewProps {
	orgId: string;
}

export const ProjectsView = ({ orgId }: ProjectsViewProps) => {
	return (
		<ViewWrapper>
			<CustomErrorBoundary>
				<Suspense fallback={<ProjectsSectionSkeleton />}>
					<ProjectsSection orgId={orgId} />
				</Suspense>
			</CustomErrorBoundary>
		</ViewWrapper>
	);
};
