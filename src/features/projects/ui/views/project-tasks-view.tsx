'use client';

import { Suspense } from 'react';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';
import { ViewWrapper } from '@/components/shared/view-wrapper';

import {
	ProjectTasksSection,
	ProjectTasksSectionSkeleton,
} from '../sections/project-tasks-section';

interface ProjectTasksViewProps {
	projectId: string;
}

export const ProjectTasksView = ({ projectId }: ProjectTasksViewProps) => {
	return (
		<ViewWrapper>
			<CustomErrorBoundary>
				<Suspense fallback={<ProjectTasksSectionSkeleton />}>
					<ProjectTasksSection projectId={projectId} />
				</Suspense>
			</CustomErrorBoundary>
		</ViewWrapper>
	);
};
