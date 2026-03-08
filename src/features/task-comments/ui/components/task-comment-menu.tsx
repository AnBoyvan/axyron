import {
	EllipsisVerticalIcon,
	MessageSquareIcon,
	PencilLineIcon,
	Trash2Icon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useRemoveTaskComment } from '../../hooks/use-remove-task-comment';
import type { TaskComment } from '../../types';

interface TaskCommentMenuProps {
	comment: TaskComment;
	variant?: 'reply' | 'comment';
	canEdit?: boolean;
	onReplyOpen: () => void;
	onEdit: () => void;
}

export const TaskCommentMenu = ({
	comment,
	variant,
	canEdit,
	onEdit,
	onReplyOpen,
}: TaskCommentMenuProps) => {
	const t = useTranslations();

	const remove = useRemoveTaskComment();

	const onRemove = () => {
		remove.mutate({
			commentId: comment.id,
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="size-8">
					<EllipsisVerticalIcon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{variant === 'comment' && (
					<DropdownMenuItem onClick={onReplyOpen}>
						<MessageSquareIcon className="size-4" />
						{t('actions.reply')}
					</DropdownMenuItem>
				)}
				{canEdit && (
					<>
						<DropdownMenuItem onClick={onEdit}>
							<PencilLineIcon className="size-4" />
							{t('actions.edit')}
						</DropdownMenuItem>
						<DropdownMenuItem variant="destructive" onClick={() => onRemove()}>
							<Trash2Icon className="size-4" />
							{t('actions.remove')}
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
