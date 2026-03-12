'use client';

import { Suspense } from 'react';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';
import { ViewWrapper } from '@/components/shared/view-wrapper';

import {
	InviteSection,
	InviteSectionSkeleton,
} from '../sections/invite-section';

interface InviteViewProps {
	inviteCode: string;
}

export const InviteView = ({ inviteCode }: InviteViewProps) => {
	return (
		<ViewWrapper className="items-center justify-center">
			<CustomErrorBoundary>
				<Suspense fallback={<InviteSectionSkeleton />}>
					<InviteSection inviteCode={inviteCode} />
				</Suspense>
			</CustomErrorBoundary>
		</ViewWrapper>
	);
};
