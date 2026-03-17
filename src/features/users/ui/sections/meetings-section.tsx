import { Skeleton } from '@/components/ui/skeleton';
import { useMeetingsByUser } from '@/features/meetings/hooks/use-meetings-by-user';
import { useMeetingsFilters } from '@/features/meetings/hooks/use-meetings-filter';
import {
	MeetingCard,
	MeetingCardSkeleton,
} from '@/features/meetings/ui/components/meeting-card';

export const MeetingsSection = () => {
	const [filters] = useMeetingsFilters();

	const { data } = useMeetingsByUser({
		dateFrom: filters.dateFrom,
		dateTo: filters.dateTo,
	});

	return (
		<div className="flex flex-1 flex-col gap-4 lg:gap-8">
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
				{data?.map(meeting => (
					<MeetingCard key={meeting.id} meeting={meeting} showOrganization />
				))}
			</div>
		</div>
	);
};

export const MeetingsSectionSkeleton = () => {
	return (
		<div className="flex flex-1 flex-col gap-4 lg:gap-8">
			<div className="flex h-7 items-center">
				<Skeleton className="h-5 w-24" />
			</div>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
				{Array.from({ length: 6 }).map((_, idx) => (
					<MeetingCardSkeleton showOrganization key={idx} />
				))}
			</div>
		</div>
	);
};
