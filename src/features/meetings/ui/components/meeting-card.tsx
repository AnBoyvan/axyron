import { useState } from 'react';

import { format } from 'date-fns';
import { CalendarClockIcon, ClockIcon } from 'lucide-react';
import { useLocale } from 'next-intl';

import { Skeleton } from '@/components/ui/skeleton';
import type { MeetingByOrg } from '@/features/meetings/types';
import { UserAvatar } from '@/features/users/ui/components/user-avatar';
import { fnsLocale } from '@/i18n/config';
import { formatDuration } from '@/lib/utils/format-duration';

import { OrgAvatar } from '../../../organizations/ui/components/org-avatar';
import { MeetingPreview } from './meeting-preview';

interface MeetingCardProps {
	meeting: MeetingByOrg;
	showOrganization?: boolean;
}

export const MeetingCard = ({
	meeting,
	showOrganization = false,
}: MeetingCardProps) => {
	const locale = useLocale();

	const [open, setOpen] = useState(false);

	const dateLocale = fnsLocale[locale];

	return (
		<>
			<MeetingPreview meeting={meeting} open={open} onOpenChange={setOpen} />
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="group flex w-full flex-col gap-2 rounded-md border bg-card p-4 transition-colors hover:bg-accent/50"
			>
				{showOrganization && (
					<div className="flex items-center gap-2">
						<OrgAvatar
							size="sm"
							name={meeting.organization.name}
							imageUrl={meeting.organization.image}
						/>
						<span>{meeting.organization.name}</span>
					</div>
				)}
				<p className="truncate text-left font-medium">{meeting.title}</p>
				<div className="flex items-center gap-2 text-muted-foreground text-sm">
					<UserAvatar
						size="xs"
						name={meeting.creator.name}
						imageUrl={meeting.creator.image}
					/>
					<span className="truncate text-xs">{meeting.creator.name}</span>
				</div>
				<div className="gap flex items-center text-muted-foreground">
					<CalendarClockIcon className="mr-2 size-4" />
					<span className="text-sm">
						{format(meeting.startTime, 'PPP - HH:mm', { locale: dateLocale })}
					</span>
				</div>
				<div className="gap flex items-center text-muted-foreground">
					<ClockIcon className="mr-2 size-4" />
					<span className="text-sm">{formatDuration(meeting.duration)}</span>
				</div>
				<div className="flex items-center justify-between">
					<div className="flex -space-x-2">
						{meeting.members.slice(0, 5).map(member => (
							<UserAvatar
								key={member.userId}
								name={member.name}
								imageUrl={member.image}
							/>
						))}
						{meeting.members.length > 5 && (
							<div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs ring-2 ring-background">
								+{meeting.members.length - 5}
							</div>
						)}
					</div>
				</div>
			</button>
		</>
	);
};

export const MeetingCardSkeleton = ({
	showOrganization = false,
}: {
	showOrganization?: boolean;
}) => {
	return (
		<div className="flex w-full flex-col gap-2 rounded-md border bg-card p-4">
			{showOrganization && (
				<div className="flex items-center gap-2">
					<Skeleton className="size-6 rounded-md" />
					<Skeleton className="h-3.5 w-32" />
				</div>
			)}
			<Skeleton className="my-1 h-4 w-32" />
			<div className="flex items-center gap-2">
				<Skeleton className="size-4 rounded-full" />
				<Skeleton className="h-3 w-28" />
			</div>
			<Skeleton className="my-0.5 h-4 w-28" />
			<Skeleton className="my-0.5 h-4 w-28" />
			<div className="flex -space-x-2">
				{Array.from({ length: 4 }).map((_, idx) => (
					<Skeleton key={idx} className="size-8 rounded-full" />
				))}
			</div>
		</div>
	);
};
