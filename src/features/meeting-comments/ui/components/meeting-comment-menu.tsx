import { EllipsisVerticalIcon, PencilLineIcon, Trash2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useRemoveMeetingComment } from '../../hooks/use-remove-meeting-comment';
import type { MeetingComment } from '../../types';

interface MeetingCommentMenuProps {
	comment: MeetingComment;
	canEdit: boolean;
	onEdit: () => void;
}

export const MeetingCommentMenu = ({
	comment,
	canEdit,
	onEdit,
}: MeetingCommentMenuProps) => {
	const t = useTranslations();
	const remove = useRemoveMeetingComment();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="size-8">
					<EllipsisVerticalIcon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{canEdit && (
					<>
						<DropdownMenuItem onClick={onEdit}>
							<PencilLineIcon />
							{t('actions.edit')}
						</DropdownMenuItem>
						<DropdownMenuItem
							variant="destructive"
							disabled={remove.isPending}
							onClick={() => remove.mutate({ commentId: comment.id })}
						>
							<Trash2Icon />
							{t('actions.remove')}
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
