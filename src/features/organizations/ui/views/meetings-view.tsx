'use client';

import { Suspense, useState } from 'react';

import { PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';
import { ViewWrapper } from '@/components/shared/view-wrapper';
import { Button } from '@/components/ui/button';
import { NewMeetingDialog } from '@/features/meetings/ui/components/new-meeting-dialog';

import { MeetingsDateFilter } from '../../../meetings/ui/components/meetings-date-filter';
import {
	MeetingsSection,
	MeetingsSectionSkeleton,
} from '../sections/meetings-section';

interface MeetingsViewProps {
	orgId: string;
}

export const MeetingsView = ({ orgId }: MeetingsViewProps) => {
	const t = useTranslations();

	const [open, setOpen] = useState(false);
	return (
		<ViewWrapper className="gap-4 lg:gap-8">
			<NewMeetingDialog orgId={orgId} open={open} onOpenChange={setOpen} />
			<div className="flex flex-col-reverse gap-4 md:flex-row md:justify-between">
				<MeetingsDateFilter />
				<Button onClick={() => setOpen(true)}>
					<PlusIcon />
					{t('meetings.schedule')}
				</Button>
			</div>
			<CustomErrorBoundary>
				<Suspense fallback={<MeetingsSectionSkeleton />}>
					<MeetingsSection orgId={orgId} />
				</Suspense>
			</CustomErrorBoundary>
		</ViewWrapper>
	);
};
