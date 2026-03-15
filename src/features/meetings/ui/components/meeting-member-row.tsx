import { EllipsisVerticalIcon, Trash2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserAvatar } from '@/features/users/ui/components/user-avatar';
import { useConfirm } from '@/hooks/use-confirm';
import { cn } from '@/lib/utils/cn';

import { useRemoveMeetingMember } from '../../hooks/use-remove-meeting-member';
import type { Attendee } from '../../types';

interface MeetingMemberRowProps {
	member: Attendee;
	meetingId: string;

	canEdit: boolean;
}

export const MeetingMemberRow = ({
	member,
	meetingId,
	canEdit,
}: MeetingMemberRowProps) => {
	const t = useTranslations();

	const [RemoveConfirmDialog, confirmRemove] = useConfirm({
		title: t('common.sure'),
		message: t('common.cannot_udone'),
		action: t('actions.remove'),
		variant: 'destructive',
	});

	const removeMember = useRemoveMeetingMember();

	const onRemove = async () => {
		const ok = await confirmRemove();
		if (!ok) return;

		removeMember.mutate({
			meetingId,
			userId: member.userId,
		});
	};

	return (
		<>
			<RemoveConfirmDialog />
			<div className="flex items-center justify-between gap-2 rounded-md p-2 hover:bg-accent/50">
				<div className="flex items-center gap-2 overflow-hidden">
					<UserAvatar name={member.name} imageUrl={member.image} />
					<div className="flex flex-col truncate">
						<span className="truncate font-medium text-sm">{member.name}</span>
						<span className="truncate text-muted-foreground text-xs">
							{member.email}
						</span>
					</div>
				</div>
				<div className="flex shrink-0 items-center gap-2">
					<Badge
						variant="outline"
						className={cn(
							'text-xs',
							member.status === 'accepted' && 'border-green-500 text-green-500',
							member.status === 'rejected' &&
								'border-destructive text-destructive',
							member.status === 'pending' && 'border-zinc-500 text-zinc-500',
						)}
					>
						{t(`meetings.member_status.${member.status}`)}
					</Badge>
					{canEdit && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon">
									<EllipsisVerticalIcon />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem
									variant="destructive"
									disabled={removeMember.isPending}
									onClick={onRemove}
								>
									<Trash2Icon />
									{t('actions.remove')}
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</div>
		</>
	);
};

export const MeetingMemberRowSkeleton = () => {
	return (
		<div className="flex items-center justify-between gap-2 rounded-md p-2">
			<div className="flex items-center gap-2 overflow-hidden"></div>
		</div>
	);
};
