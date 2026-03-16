import { useTranslations } from 'next-intl';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useMeetingsByOrg } from '@/features/meetings/hooks/use-meetings-by-org';
import {
	MeetingCard,
	MeetingCardSkeleton,
} from '@/features/meetings/ui/components/meeting-card';
import { getCurrentDayRange } from '@/lib/utils/get-current-day-range';

interface TodayMeetingsSectionProps {
	orgId: string;
}

export const TodayMeetingsSection = ({ orgId }: TodayMeetingsSectionProps) => {
	const t = useTranslations();

	const { start: dateFrom, end: dateTo } = getCurrentDayRange();

	const { data } = useMeetingsByOrg({
		orgId,
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
							<MeetingCard key={meeting.id} meeting={meeting} />
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
						<MeetingCardSkeleton key={idx} />
					))}
				</div>
			</CardContent>
		</Card>
	);
};
