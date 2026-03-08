'use client';

import { Suspense } from 'react';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';
import { ViewWrapper } from '@/components/shared/view-wrapper';

import {
	TaskCommentsSection,
	TaskCommentsSectionSkeleton,
} from '../sections/task-comments-section';
import {
	TaskMainSection,
	TaskMainSectionSkeleton,
} from '../sections/task-main-section';

interface TaskViewProps {
	taskId: string;
}

export const TaskView = ({ taskId }: TaskViewProps) => {
	return (
		<ViewWrapper className="grid grid-cols-1 p-0 lg:grid-cols-3 lg:p-0">
			<div className="col-span-1 flex flex-col gap-4 lg:col-span-2 lg:gap-8">
				<CustomErrorBoundary>
					<Suspense fallback={<TaskMainSectionSkeleton />}>
						<TaskMainSection taskId={taskId} />
					</Suspense>
				</CustomErrorBoundary>
				<CustomErrorBoundary>
					<Suspense fallback={<TaskCommentsSectionSkeleton />}>
						<TaskCommentsSection taskId={taskId} />
					</Suspense>
				</CustomErrorBoundary>
			</div>
			<div className="border-l"></div>
		</ViewWrapper>
	);
};
