import { useState } from 'react';

import { UserPlusIcon, UsersIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

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
