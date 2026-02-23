'use client';

import { Suspense } from 'react';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';

import { ProjectOverview } from '../components/projects-overview';

interface ProjectOverviewViewProps {
	projectId: string;
}

export const ProjectOverviewView = ({
	projectId,
}: ProjectOverviewViewProps) => {
	return (
		<Suspense fallback={<div>loading...</div>}>
			<CustomErrorBoundary>
				<ProjectOverview projectId={projectId} />
			</CustomErrorBoundary>
		</Suspense>
	);
};
