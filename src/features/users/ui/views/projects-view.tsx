'use client';

import { Suspense } from 'react';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';
import { ViewWrapper } from '@/components/shared/view-wrapper';

import {
	ProjectsSection,
	ProjectsSectionSkeleton,
} from '../sections/projects-section';

export const ProjectsView = () => {
	return (
		<ViewWrapper>
			<CustomErrorBoundary>
				<Suspense fallback={<ProjectsSectionSkeleton />}>
					<ProjectsSection />
				</Suspense>
			</CustomErrorBoundary>
		</ViewWrapper>
	);
};
