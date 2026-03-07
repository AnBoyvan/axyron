import { EllipsisVerticalIcon, UserXIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRemoveAssignee } from '@/features/tasks/hooks/use-remove-assignee';

interface TaskAssigneeMenuProps {
	taskId: string;
	userId: string;
}

export const TaskAssigneeMenu = ({ taskId, userId }: TaskAssigneeMenuProps) => {
	const t = useTranslations();

	const removeAssignee = useRemoveAssignee();

	const onRemove = () => {
		removeAssignee.mutate({
			taskId,
			userId,
		});
	};
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<EllipsisVerticalIcon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem variant="destructive" onClick={onRemove}>
					<UserXIcon />
					{t('actions.remove')}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
