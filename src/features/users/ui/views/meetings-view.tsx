'use client';

import { Suspense } from 'react';

import { useTranslations } from 'next-intl';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';
import { ViewWrapper } from '@/components/shared/view-wrapper';
import { MeetingsDateFilter } from '@/features/meetings/ui/components/meetings-date-filter';

import {
	MeetingsSection,
	MeetingsSectionSkeleton,
} from '../sections/meetings-section';

export const MeetingsView = () => {
	const t = useTranslations();
	return (
		<ViewWrapper className="gap-4 lg:gap-8">
			<h1 className="text-xl">{t('users.my_meetings')}</h1>
			<MeetingsDateFilter />
			<CustomErrorBoundary>
				<Suspense fallback={<MeetingsSectionSkeleton />}>
					<MeetingsSection />
				</Suspense>
			</CustomErrorBoundary>
		</ViewWrapper>
	);
};
