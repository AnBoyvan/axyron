'use client';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';

import { ProjectTasks } from '../components/project-tasks';

interface ProjectTasksViewProps {
	projectId: string;
}

export const ProjectTasksView = ({ projectId }: ProjectTasksViewProps) => {
	return (
		<CustomErrorBoundary fallback={<div />}>
			<ProjectTasks projectId={projectId} />
		</CustomErrorBoundary>
	);
};
