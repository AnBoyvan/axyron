'use client';

import { Suspense } from 'react';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';
import { ViewWrapper } from '@/components/shared/view-wrapper';
import { MeetingsDateFilter } from '@/features/meetings/ui/components/meetings-date-filter';

import {
	MeetingsSection,
	MeetingsSectionSkeleton,
} from '../sections/meetings-section';

export const MeetingsView = () => {
	return (
		<ViewWrapper className="gap-4 lg:gap-8">
			<MeetingsDateFilter />
			<CustomErrorBoundary>
				<Suspense fallback={<MeetingsSectionSkeleton />}>
					<MeetingsSection />
				</Suspense>
			</CustomErrorBoundary>
		</ViewWrapper>
	);
};
