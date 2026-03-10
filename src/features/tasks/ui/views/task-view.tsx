'use client';

import { Suspense, useState } from 'react';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';
import { ViewWrapper } from '@/components/shared/view-wrapper';

import { TaskActivityMobile } from '../components/task-activity-mobile';
import {
	TaskActivitySection,
	TaskActivitySectionSkeleton,
} from '../sections/task-activity-section';
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
	const [activitiesOpen, setActivitiesOpen] = useState(false);

	return (
		<ViewWrapper className="grid grid-cols-1 p-0 lg:grid-cols-3 lg:p-0">
			<div className="col-span-1 flex flex-col gap-4 lg:col-span-2 lg:gap-8">
				<CustomErrorBoundary>
					<Suspense fallback={<TaskMainSectionSkeleton />}>
						<TaskMainSection
							taskId={taskId}
							openActivities={setActivitiesOpen}
						/>
					</Suspense>
				</CustomErrorBoundary>
				<CustomErrorBoundary>
					<Suspense fallback={<TaskCommentsSectionSkeleton />}>
						<TaskCommentsSection taskId={taskId} />
					</Suspense>
				</CustomErrorBoundary>
			</div>
			<div className="hidden border-l lg:col-span-1 lg:block">
				<CustomErrorBoundary>
					<Suspense fallback={<TaskActivitySectionSkeleton />}>
						<TaskActivitySection taskId={taskId} />
					</Suspense>
				</CustomErrorBoundary>
			</div>
			<div className="lg:hidden">
				<CustomErrorBoundary>
					<Suspense>
						<TaskActivityMobile
							taskId={taskId}
							open={activitiesOpen}
							onOpenChange={setActivitiesOpen}
						/>
					</Suspense>
				</CustomErrorBoundary>
			</div>
		</ViewWrapper>
	);
};
