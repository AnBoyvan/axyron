'use client';

import { Suspense } from 'react';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';

import {
	ProjectTasks,
	ProjectTasksSkeleton,
} from '../components/project-tasks';

interface ProjectTasksViewProps {
	projectId: string;
}

export const ProjectTasksView = ({ projectId }: ProjectTasksViewProps) => {
	return (
		<Suspense fallback={<ProjectTasksSkeleton />}>
			<CustomErrorBoundary>
				<ProjectTasks projectId={projectId} />
			</CustomErrorBoundary>
		</Suspense>
	);
};
