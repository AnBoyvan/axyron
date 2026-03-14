import { UsersIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Separator } from '@/components/ui/separator';
import type { Task } from '@/features/tasks/types';
import { UserAvatar } from '@/features/users/ui/components/user-avatar';

interface TaskPreviewAssigneesProps {
	assignees: Task['assignees'];
}

export const TaskPreviewAssignees = ({
	assignees,
}: TaskPreviewAssigneesProps) => {
	const t = useTranslations();

	if (assignees.length === 0) return null;

	return (
		<>
			<Separator />
			<div className="flex flex-col gap-2">
				<div className="flex items-center gap-1.5 text-muted-foreground">
					<UsersIcon className="size-3.5" />
					<p className="font-medium text-xs uppercase tracking-wide">
						{t('common.assignees')} ({assignees.length})
					</p>
				</div>
				<div className="flex flex-col gap-2">
					{assignees.map(assignee => (
						<div key={assignee.userId} className="flex items-center gap-2">
							<UserAvatar name={assignee.name} imageUrl={assignee.image} />
							<div className="flex flex-col truncate">
								<span className="truncate font-medium text-sm">
									{assignee.name}
								</span>
								<span className="truncate text-muted-foreground text-xs">
									{assignee.email}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	);
};
