import { useState } from 'react';

import {
	CopyIcon,
	EllipsisVerticalIcon,
	PencilLineIcon,
	Trash2Icon,
	TriangleAlertIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useConfirm } from '@/hooks/use-confirm';

import { useRemoveTask } from '../../hooks/use-remove-task';
import type { TaskById } from '../../types';
import { EditTaskDialog } from './edit-task-dialog';

interface TaskMenuProps {
	task: TaskById;
}

export const TaskMenu = ({ task }: TaskMenuProps) => {
	const t = useTranslations();

	const [RemoveConfirmDialog, confirmRemove] = useConfirm({
		title: t('common.sure'),
		message: t('tasks.remove_confirm'),
		action: t('actions.remove'),
		variant: 'destructive',
		media: <TriangleAlertIcon className="size-10 text-destructive" />,
	});

	const [isEditOpen, setIsEditOpen] = useState(false);

	const removeTask = useRemoveTask();

	const onRemove = async () => {
		const ok = await confirmRemove();

		if (!ok) return;

		removeTask.mutate({
			taskId: task.id,
		});
	};

	const onCopyLink = async () => {
		const fullUrl = `${process.env.NEXT_PUBLIC_APP_URL}${task.link}`;
		navigator.clipboard.writeText(fullUrl);
		toast.success(t('common.link_copied'));
	};

	const canEdit = task.permissions.canCreateTask;
	const canRemove =
		task.permissions.isOrgAdmin || task.permissions.isProjectAdmin;

	return (
		<>
			<RemoveConfirmDialog />
			<EditTaskDialog
				task={task}
				open={isEditOpen}
				onOpenChange={setIsEditOpen}
			/>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button size="icon" variant="ghost">
						<EllipsisVerticalIcon />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" side="bottom" className="w-52">
					<DropdownMenuItem onClick={onCopyLink}>
						<CopyIcon />
						{t('actions.copy_link')}
					</DropdownMenuItem>
					{canEdit && (
						<DropdownMenuItem onClick={() => setIsEditOpen(true)}>
							<PencilLineIcon />
							{t('tasks.edit')}
						</DropdownMenuItem>
					)}
					{canRemove && (
						<>
							<DropdownMenuSeparator />
							<DropdownMenuItem variant="destructive" onClick={onRemove}>
								<Trash2Icon />
								{t('actions.remove')}
							</DropdownMenuItem>
						</>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};
