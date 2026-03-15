'use client';

import { Suspense } from 'react';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';
import { ViewWrapper } from '@/components/shared/view-wrapper';

import {
	MeetingCommentsSection,
	MeetingCommentsSectionSkeleton,
} from '../sections/meeting-comments-section';
import {
	MeetingMainSection,
	MeetingMainSectionSkeleton,
} from '../sections/meeting-main-section';

interface MeetingViewProps {
	meetingId: string;
}

export const MeetingView = ({ meetingId }: MeetingViewProps) => {
	return (
		<ViewWrapper className="grid grid-cols-1 p-0 lg:grid-cols-3 lg:p-0">
			<div className="col-span-1 lg:col-span-2">
				<CustomErrorBoundary>
					<Suspense fallback={<MeetingMainSectionSkeleton />}>
						<MeetingMainSection meetingId={meetingId} />
					</Suspense>
				</CustomErrorBoundary>
			</div>
			<div className="col-span-1 border-t lg:border-t-0 lg:border-l">
				<CustomErrorBoundary>
					<Suspense fallback={<MeetingCommentsSectionSkeleton />}>
						<MeetingCommentsSection meetingId={meetingId} />
					</Suspense>
				</CustomErrorBoundary>
			</div>
		</ViewWrapper>
	);
};
