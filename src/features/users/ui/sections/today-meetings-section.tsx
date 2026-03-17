import { useTranslations } from 'next-intl';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useMeetingsByUser } from '@/features/meetings/hooks/use-meetings-by-user';
import {
	MeetingCard,
	MeetingCardSkeleton,
} from '@/features/meetings/ui/components/meeting-card';
import { getCurrentDayRange } from '@/lib/utils/get-current-day-range';

export const TodayMeetingsSection = () => {
	const t = useTranslations();

	const { start: dateFrom, end: dateTo } = getCurrentDayRange();

	const { data } = useMeetingsByUser({
		dateFrom,
		dateTo,
	});

	return (
		<Card className="col-span-1 gap-4 bg-muted">
			<CardHeader className="flex items-center justify-between">
				<CardTitle className="text-lg">{t('meetings.today')}</CardTitle>
			</CardHeader>
			<CardContent>
				{data.length > 0 ? (
					<div className="flex flex-col gap-4">
						{data?.map(meeting => (
							<MeetingCard
								key={meeting.id}
								meeting={meeting}
								showOrganization
							/>
						))}
					</div>
				) : (
					<p className="text-muted-foreground italic">
						{t('meetings.no_today')}
					</p>
				)}
			</CardContent>
		</Card>
	);
};

export const TodayMeetingsSectionSkeleton = () => {
	return (
		<Card className="col-span-1 gap-2 bg-muted">
			<CardHeader className="flex items-center justify-between">
				<Skeleton className="h-5 w-40" />
			</CardHeader>
			<CardContent>
				<div className="flex flex-col gap-4">
					{Array.from({ length: 3 }).map((_, idx) => (
						<MeetingCardSkeleton key={idx} showOrganization />
					))}
				</div>
			</CardContent>
		</Card>
	);
};
