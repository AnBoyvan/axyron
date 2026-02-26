'use client';

import { Suspense } from 'react';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';

import {
	ProjectTasksSection,
	ProjectTasksSectionSkeleton,
} from '../sections/project-tasks-section';

interface ProjectTasksViewProps {
	projectId: string;
}

export const ProjectTasksView = ({ projectId }: ProjectTasksViewProps) => {
	return (
		<Suspense fallback={<ProjectTasksSectionSkeleton />}>
			<CustomErrorBoundary>
				<ProjectTasksSection projectId={projectId} />
			</CustomErrorBoundary>
		</Suspense>
	);
};
