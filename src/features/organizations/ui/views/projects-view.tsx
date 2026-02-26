'use client';

import { Suspense } from 'react';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';

import {
	ProjectsSection,
	ProjectsSectionSkeleton,
} from '../sections/projects-section';

interface ProjectsViewProps {
	orgId: string;
}

export const ProjectsView = ({ orgId }: ProjectsViewProps) => {
	return (
		<Suspense fallback={<ProjectsSectionSkeleton />}>
			<CustomErrorBoundary>
				<ProjectsSection orgId={orgId} />
			</CustomErrorBoundary>
		</Suspense>
	);
};
