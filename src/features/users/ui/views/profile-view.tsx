'use client';

import { Suspense } from 'react';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';
import { ViewWrapper } from '@/components/shared/view-wrapper';

import {
	ProfileSection,
	ProfileSectionSkeleton,
} from '../sections/profile-section';

export const ProfileView = () => {
	return (
		<ViewWrapper>
			<CustomErrorBoundary>
				<Suspense fallback={<ProfileSectionSkeleton />}>
					<ProfileSection />
				</Suspense>
			</CustomErrorBoundary>
		</ViewWrapper>
	);
};
