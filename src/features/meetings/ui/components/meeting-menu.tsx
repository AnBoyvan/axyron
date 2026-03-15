import { EllipsisVerticalIcon, Trash2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useConfirm } from '@/hooks/use-confirm';

import { useRemoveMeeting } from '../../hooks/use-remove-meeting';

interface MeetingMenuProps {
	meetingId: string;
}

export const MeetingMenu = ({ meetingId }: MeetingMenuProps) => {
	const t = useTranslations();

	const [RemoveConfirmDialog, confirmRemove] = useConfirm({
		title: t('common.sure'),
		message: t('common.cannot_udone'),
		action: t('actions.remove'),
		variant: 'destructive',
	});

	const removeMeeting = useRemoveMeeting();

	const onRemove = async () => {
		const ok = await confirmRemove();
		if (!ok) return;

		removeMeeting.mutate({ meetingId });
	};

	return (
		<>
			<RemoveConfirmDialog />
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon">
						<EllipsisVerticalIcon />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem
						variant="destructive"
						disabled={removeMeeting.isPending}
						onClick={onRemove}
					>
						<Trash2Icon />
						{t('actions.remove')}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};
