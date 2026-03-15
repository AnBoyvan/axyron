import Link from 'next/link';

import { format } from 'date-fns';
import {
	CalendarClockIcon,
	CheckIcon,
	CircleQuestionMarkIcon,
	ClockIcon,
	ExternalLinkIcon,
	LinkIcon,
	XIcon,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import type { AttendeeStatus, Meeting } from '@/features/meetings/types';
import { UserAvatar } from '@/features/users/ui/components/user-avatar';
import { fnsLocale } from '@/i18n/config';
import { authClient } from '@/lib/auth/auth-client';
import { formatDuration } from '@/lib/utils/format-duration';

import { useChangeMeetingMemberStatus } from '../../hooks/use-change-meeting-member-status';

interface MeetingPreviewProps {
	meeting: Meeting;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const MeetingPreview = ({
	meeting,
	open,
	onOpenChange,
}: MeetingPreviewProps) => {
	const t = useTranslations();
	const locale = useLocale();
	const { data } = authClient.useSession();

	const dateLocale = fnsLocale[locale];
	const userAsMember = meeting.members.find(m => m.userId === data?.user.id);

	const changeStatus = useChangeMeetingMemberStatus();

	const onStatusChange = (status: AttendeeStatus) => {
		changeStatus.mutate({
			meetingId: meeting.id,
			status,
		});
	};

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="flex flex-col gap-0 overflow-y-auto">
				<SheetHeader className="px-6 py-4">
					<SheetTitle className="pr-6 text-lg">
						{t('meetings.details')}
					</SheetTitle>
				</SheetHeader>
				<Separator />
				{userAsMember && (
					<>
						<div className="grid grid-cols-3 gap-1 px-6 py-4 lg:gap-2">
							<Button
								size="xs"
								variant="success"
								onClick={() => onStatusChange('accepted')}
								className="w-full"
							>
								<CheckIcon />
								{t('actions.accept')}
							</Button>
							<Button
								size="xs"
								variant="outline"
								onClick={() => onStatusChange('pending')}
								className="w-full"
							>
								<CircleQuestionMarkIcon />
								{t('common.tentative')}
							</Button>
							<Button
								size="xs"
								variant="destructive"
								onClick={() => onStatusChange('rejected')}
								className="w-full"
							>
								<XIcon />
								{t('actions.decline')}
							</Button>
						</div>
						<Separator />
					</>
				)}
				<div className="flex flex-col gap-2 px-6 py-4">
					<p className="text-lg">{meeting.title}</p>
					<div className="flex items-center text-muted-foreground">
						<CalendarClockIcon className="mr-2 size-4" />
						<span>
							{format(meeting.startTime, 'PPP - HH:mm', {
								locale: dateLocale,
							})}
						</span>
					</div>
					<div className="flex items-center text-muted-foreground">
						<ClockIcon className="mr-2 size-4" />
						<span>{formatDuration(meeting.duration, dateLocale)}</span>
					</div>
				</div>
				<Separator />
				<div className="flex flex-col gap-5 p-6">
					{meeting.description && (
						<div className="flex flex-col gap-1">
							<p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
								{t('common.description')}
							</p>
							<p className="text-sm">{meeting.description}</p>
						</div>
					)}
					{meeting.meetingUrl && (
						<div className="flex flex-col gap-1">
							<p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
								{t('common.link')}
							</p>
							<Link
								href={meeting.meetingUrl}
								target="_blank"
								rel="noreferrer"
								className="flex items-center gap-2 truncate text-primary text-sm hover:underline"
							>
								<LinkIcon className="size-4 shrink-0" />
								<span className="truncate">{meeting.meetingUrl}</span>
							</Link>
						</div>
					)}
					<div className="flex flex-col gap-2">
						<p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
							{t('common.organizer')}
						</p>
						<div className="flex items-center gap-2">
							<UserAvatar
								name={meeting.creator.name}
								imageUrl={meeting.creator.image}
							/>
							<div className="flex flex-col">
								<span className="font-medium text-sm">
									{meeting.creator.name}
								</span>
								<span className="text-muted-foreground text-xs">
									{meeting.creator.email}
								</span>
							</div>
						</div>
					</div>
					<Separator />
					<div className="flex flex-col gap-2">
						<p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
							{t('common.attendees')} ({meeting.members.length})
						</p>
						<div className="flex flex-col gap-2">
							{meeting.members.map(member => (
								<div
									key={member.userId}
									className="flex max-w-full items-center justify-between gap-2 overflow-hidden"
								>
									<div className="flex items-center gap-2 overflow-hidden">
										<UserAvatar name={member.name} imageUrl={member.image} />
										<div className="flex flex-col truncate">
											<span className="truncate font-medium text-sm">
												{member.name}
											</span>
											<span className="truncate text-muted-foreground text-xs">
												{member.email}
											</span>
										</div>
									</div>
									<Badge
										variant="outline"
										className={`text-xs ${
											member.status === 'accepted'
												? 'border-green-500 text-green-500'
												: member.status === 'rejected'
													? 'border-destructive text-destructive'
													: 'border-zinc-500 text-zinc-500'
										}`}
									>
										{t(`meetings.member_status.${member.status}`)}
									</Badge>
								</div>
							))}
						</div>
					</div>
					{meeting.commentsCount > 0 && (
						<>
							<Separator />
							<p className="text-muted-foreground text-sm">
								{meeting.commentsCount} {t('common.comments')}
							</p>
						</>
					)}
				</div>
				<div className="mt-auto border-t p-4">
					<Button asChild className="w-full">
						<Link
							href={`/org/${meeting.organizationId}/meetings/${meeting.id}`}
							onClick={() => {
								onOpenChange(false);
							}}
						>
							<ExternalLinkIcon />
							{t('actions.open')}
						</Link>
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
};
