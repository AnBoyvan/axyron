'use client';

import { Suspense } from 'react';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';
import { ViewWrapper } from '@/components/shared/view-wrapper';

import { MeetingsSection } from '../sections/meetings-section';

interface MeetingsViewProps {
	orgId: string;
	dateFrom?: string;
	dateTo?: string;
}

export const MeetingsView = ({
	orgId,
	dateFrom,
	dateTo,
}: MeetingsViewProps) => {
	return (
		<ViewWrapper>
			<CustomErrorBoundary>
				<Suspense fallback={<div />}>
					<MeetingsSection orgId={orgId} dateFrom={dateFrom} dateTo={dateTo} />
				</Suspense>
			</CustomErrorBoundary>
		</ViewWrapper>
	);
};
