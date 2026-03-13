'use client';

import { Suspense } from 'react';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';
import { ViewWrapper } from '@/components/shared/view-wrapper';

import { EditSection, EditSectionSkeleton } from '../sections/edit-section';

interface OrgSettingsViewProps {
	orgId: string;
}

export const OrgSettingsView = ({ orgId }: OrgSettingsViewProps) => {
	return (
		<ViewWrapper>
			<CustomErrorBoundary>
				<Suspense fallback={<EditSectionSkeleton />}>
					<EditSection orgId={orgId} />
				</Suspense>
			</CustomErrorBoundary>
		</ViewWrapper>
	);
};
