'use client';

import { Suspense } from 'react';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';
import { ViewWrapper } from '@/components/shared/view-wrapper';

import {
	UserTasksSection,
	UserTasksSectionSkeleton,
} from '../sections/user-tasks-section';

export const UserTasksView = () => {
	return (
		<ViewWrapper>
			<CustomErrorBoundary>
				<Suspense fallback={<UserTasksSectionSkeleton />}>
					<UserTasksSection />
				</Suspense>
			</CustomErrorBoundary>
		</ViewWrapper>
	);
};
