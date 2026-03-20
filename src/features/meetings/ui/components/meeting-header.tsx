import Link from 'next/link';

import { ArrowLeftIcon, CheckIcon, XIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { authClient } from '@/lib/auth/auth-client';
import { cn } from '@/lib/utils/cn';

import { useChangeMeetingMemberStatus } from '../../hooks/use-change-meeting-member-status';
import type { AttendeeStatus, Meeting } from '../../types';
import { MeetingMenu } from './meeting-menu';

interface MeetingHeaderProps {
	meeting: Meeting;
}

export const MeetingHeader = ({ meeting }: MeetingHeaderProps) => {
	const t = useTranslations();
	const { data } = authClient.useSession();
	const isMobile = useIsMobile();

	const userAsMember = meeting.members.find(m => m.userId === data?.user.id);

	const changeStatus = useChangeMeetingMemberStatus();

	const onStatusChange = (status: AttendeeStatus) => {
		changeStatus.mutate({
			meetingId: meeting.id,
			status,
		});
	};

	return (
		<div className="flex h-13 items-center gap-4 border-b px-4 py-2">
			<Button asChild size="icon" variant="ghost">
				<Link href={`/org/${meeting.organizationId}/meetings`}>
					<ArrowLeftIcon />
				</Link>
			</Button>
			{userAsMember && (
				<div className="mx-auto grid grid-cols-2 gap-4">
					<Button
						size={isMobile ? 'xs' : 'sm'}
						variant="success"
						onClick={() => onStatusChange('accepted')}
						className="w-full"
					>
						<CheckIcon />
						{t('actions.accept')}
					</Button>
					<Button
						size={isMobile ? 'xs' : 'sm'}
						variant="destructive"
						onClick={() => onStatusChange('rejected')}
						className="w-full"
					>
						<XIcon />
						{t('actions.decline')}
					</Button>
				</div>
			)}
			<div className={cn(!userAsMember && 'ml-auto')}>
				{meeting.permissions.isAdmin && <MeetingMenu meetingId={meeting.id} />}
			</div>
		</div>
	);
};

export const MeetingHeaderSkeleton = () => (
	<div className="flex h-13 items-center gap-4 border-b px-4 py-2">
		<div className="flex size-9 items-center justify-center">
			<ArrowLeftIcon className="size-4 text-muted-foreground" />
		</div>
	</div>
);
