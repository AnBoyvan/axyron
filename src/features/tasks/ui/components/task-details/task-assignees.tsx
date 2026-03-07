import { useMemo, useState } from 'react';

import { UserPlusIcon, UsersIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import type { TaskById } from '@/features/tasks/types';
import { UserAvatar } from '@/features/users/ui/components/user-avatar';

import { AddAssigneesDialog } from '../add-assignees-dialog';
import { TaskAssigneeMenu } from './task-assignee-menu';

interface TaskAssigneesProps {
	taskId: string;
	projectId: string;
	assignees: TaskById['assignees'];
	canUpdate?: boolean;
}

export const TaskAssignees = ({
	taskId,
	projectId,
	assignees,
	canUpdate,
}: TaskAssigneesProps) => {
	const t = useTranslations();

	const [open, setOpen] = useState(false);

	const existedAssigneeIds = useMemo(() => {
		return assignees.map(assignee => assignee.userId);
	}, [assignees]);

	return (
		<div className="flex flex-col">
			<div className="flex h-8 items-center gap-2 text-muted-foreground">
				<UsersIcon className="size-4" />
				<h2 className="font-semibold text-base">{t('common.assignees')}</h2>
				{canUpdate && (
					<>
						<AddAssigneesDialog
							taskId={taskId}
							projectId={projectId}
							existedIds={existedAssigneeIds}
							open={open}
							onOpenChange={setOpen}
						/>
						<Button
							size="icon-sm"
							variant="ghost"
							onClick={() => setOpen(true)}
							className="text-primary"
						>
							<UserPlusIcon />
						</Button>
					</>
				)}
			</div>
			{assignees.length > 0 ? (
				<div className="grid grid-cols-1 gap-2 pt-2 md:grid-cols-2 2xl:grid-cols-3">
					{assignees.map(assignee => (
						<div
							key={assignee.userId}
							className="flex w-full items-center gap-2 overflow-hidden rounded-md bg-muted p-2"
						>
							<UserAvatar
								imageUrl={assignee.image}
								name={assignee.name}
								form="square"
								size="lg"
							/>
							<div className="flex flex-1 flex-col truncate">
								<p className="truncate">{assignee.name}</p>
								<p className="truncate text-muted-foreground text-sm">
									{assignee.email}
								</p>
							</div>
							{canUpdate && (
								<TaskAssigneeMenu userId={assignee.userId} taskId={taskId} />
							)}
						</div>
					))}
				</div>
			) : (
				<p className="text-muted-foreground italic">
					{t('tasks.not_assigned')}
				</p>
			)}
		</div>
	);
};
