'use client';

import { Suspense } from 'react';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';

interface ProjectOverviewViewProps {
	projectId: string;
}

export const ProjectOverviewView = ({
	projectId,
}: ProjectOverviewViewProps) => {
	return (
		<Suspense fallback={<div />}>
			<CustomErrorBoundary>
				<div></div>
			</CustomErrorBoundary>
		</Suspense>
	);
};
