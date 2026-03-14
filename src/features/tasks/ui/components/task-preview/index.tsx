import Link from 'next/link';

import { ExternalLinkIcon, TextIcon, TriangleAlertIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import type { Task } from '@/features/tasks/types';
import { resolveTaskStatus } from '@/features/tasks/utils/resolve-task-status';

import { TaskPreviewAssignees } from './task-preview-assignees';
import { TaskPreviewDates } from './task-preview-dates';
import { TaskPreviewStatus } from './task-preview-status';
import { TaskPreviewSubtasks } from './task-preview-subtasks';

interface TaskPreviewProps {
	task: Task;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const TaskPreview = ({ task, open, onOpenChange }: TaskPreviewProps) => {
	const t = useTranslations();

	const resolvedStatus = resolveTaskStatus({
		status: task.status,
		dueDate: task.dueDate,
	});

	const isOverdue = resolvedStatus === 'overdue';

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				aria-describedby={undefined}
				className="flex flex-col gap-0 overflow-y-auto"
			>
				<SheetHeader className="px-6 py-4">
					<SheetTitle className="pr-6 text-lg">{t('tasks.details')}</SheetTitle>
				</SheetHeader>
				<Separator />
				<TaskPreviewStatus task={task} />
				<Separator />
				<div className="flex flex-col gap-4 p-6">
					<div className="flex flex-col gap-1">
						<p className="text-lg leading-snug">{task.title}</p>
						{isOverdue && (
							<div className="flex items-center gap-2">
								<TriangleAlertIcon className="size-4 text-destructive" />
								<p className="font-bold text-destructive text-sm">
									{t('tasks.overdue_alert')}
								</p>
							</div>
						)}
					</div>
					{(task.startDate || task.dueDate) && (
						<TaskPreviewDates
							startDate={task.startDate}
							dueDate={task.dueDate}
							isOverdue={isOverdue}
						/>
					)}
					{task.description && (
						<div className="flex flex-col gap-1">
							<div className="flex items-center gap-1.5 text-muted-foreground">
								<TextIcon className="size-3.5" />
								<p className="font-medium text-xs uppercase leading-0 tracking-wide">
									{t('common.description')}
								</p>
							</div>
							<p className="text-sm leading-relaxed">{task.description}</p>
						</div>
					)}
					<TaskPreviewSubtasks
						subtasks={task.subtasks}
						canEdit={task.permissions.canCreateTask}
					/>
					<TaskPreviewAssignees assignees={task.assignees} />
				</div>
				<div className="mt-auto border-t p-4">
					<Button asChild className="w-full">
						<Link href={task.link} onClick={() => onOpenChange(false)}>
							<ExternalLinkIcon />
							{t('actions.open')}
						</Link>
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
};
