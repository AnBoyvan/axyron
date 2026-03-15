import { useState } from 'react';

import { UserPlusIcon, UsersIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import type { Meeting } from '../../types';
import { AddAttendeesDialog } from './add-attendees-dialog';
import { MeetingMemberRow } from './meeting-member-row';

interface MeetingMembersProps {
	meeting: Meeting;
	canEdit: boolean;
}

export const MeetingMembers = ({ meeting, canEdit }: MeetingMembersProps) => {
	const t = useTranslations();

	const [open, setOpen] = useState(false);

	const existedMembersIds = meeting.members.map(member => member.userId);

	return (
		<>
			<AddAttendeesDialog
				meetingId={meeting.id}
				orgId={meeting.organizationId}
				existedIds={existedMembersIds}
				open={open}
				onOpenChange={setOpen}
			/>
			<div className="flex flex-col gap-2">
				<div className="flex items-center gap-2 text-muted-foreground">
					<UsersIcon className="size-4" />
					<span className="font-medium text-xs uppercase tracking-wide">
						{t('common.attendees')} ({meeting.members.length})
					</span>
					{canEdit && (
						<Button
							size="icon-sm"
							variant="ghost"
							className="ml-auto text-primary"
							onClick={() => setOpen(true)}
						>
							<UserPlusIcon />
						</Button>
					)}
				</div>
				<div className="flex flex-col">
					{meeting.members.map(member => (
						<MeetingMemberRow
							key={member.userId}
							member={member}
							canEdit={canEdit}
							meetingId={meeting.id}
						/>
					))}
				</div>
			</div>
		</>
	);
};

export const MeetingMembersSkeleton = () => {
	return (
		<div className="flex flex-col gap-2">
			<Skeleton className="h-3 w-24" />
			{Array.from({ length: 3 }).map((_, i) => (
				<div key={i} className="flex items-center gap-2 p-2">
					<Skeleton className="size-8 shrink-0 rounded-full" />
					<div className="flex flex-col gap-1">
						<Skeleton className="h-4 w-28" />
						<Skeleton className="h-3 w-36" />
					</div>
				</div>
			))}
		</div>
	);
};
