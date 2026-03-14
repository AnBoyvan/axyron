import { useMeetingsByOrg } from '@/features/meetings/hooks/use-meetings-by-org';
import { useMeetingsFilters } from '@/features/meetings/hooks/use-meetings-filter';

import {
	MeetingCard,
	MeetingCardSkeleton,
} from '../../../meetings/ui/components/meeting-card';

interface MeetingsSectionProps {
	orgId: string;
}

export const MeetingsSection = ({ orgId }: MeetingsSectionProps) => {
	const [filters] = useMeetingsFilters();

	const { data } = useMeetingsByOrg({
		orgId,
		dateFrom: filters.dateFrom,
		dateTo: filters.dateTo,
	});

	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
			{data?.map(meeting => (
				<MeetingCard key={meeting.id} meeting={meeting} />
			))}
		</div>
	);
};

export const MeetingsSectionSkeleton = ({
	showOrganization = false,
}: {
	showOrganization?: boolean;
}) => {
	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
			{Array.from({ length: 6 }).map((_, idx) => (
				<MeetingCardSkeleton showOrganization={showOrganization} key={idx} />
			))}
		</div>
	);
};
