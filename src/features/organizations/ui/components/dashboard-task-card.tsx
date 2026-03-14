import Link from 'next/link';
import { useState } from 'react';

import { formatDistanceToNow } from 'date-fns';
import { DotIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { taskPriority } from '@/features/tasks/configs/task-priority-options';
import { taskStatuses } from '@/features/tasks/configs/task-status-options';
import type { Task } from '@/features/tasks/types';
import { TaskPreview } from '@/features/tasks/ui/components/task-preview';
import { resolveTaskStatus } from '@/features/tasks/utils/resolve-task-status';
import { fnsLocale } from '@/i18n/config';
import { cn } from '@/lib/utils/cn';

interface DashboardTaskCardProps {
	task: Task;
	isFirst?: boolean;
}

export const DashboardTaskCard = ({
	task,
	isFirst,
}: DashboardTaskCardProps) => {
	const t = useTranslations();
	const locale = useLocale();

	const [open, setOpen] = useState(false);

	const resolvedStatus = resolveTaskStatus({
		status: task.status,
		dueDate: task.dueDate,
	});

	const taskStatus = taskStatuses[resolvedStatus];
	const priority = taskPriority[task.priority];

	return (
		<>
			<TaskPreview task={task} open={open} onOpenChange={setOpen} />
			<div
				className={cn('flex items-center gap-4 py-3', !isFirst && 'border-t')}
			>
				<div className="flex w-4 shrink-0 items-center justify-center">
					<Tooltip>
						<TooltipTrigger>
							<taskStatus.icon className={cn('size-4', taskStatus.iconStyle)} />
						</TooltipTrigger>
						<TooltipContent>
							<p>{t(taskStatus.label)}</p>
						</TooltipContent>
					</Tooltip>
				</div>
				<div className="flex flex-1 flex-col gap-1">
					<div className="flex flex-1 items-center justify-between gap-4">
						<button
							onClick={() => setOpen(true)}
							className="line-clamp-1 cursor-pointer transition-colors hover:text-accent-foreground"
						>
							{task.title}
						</button>
						<Badge variant="outline" className={cn(priority.badge)}>
							{t(priority.label)}
						</Badge>
					</div>
					<div className="flex items-center">
						<Link
							href={`org/${task.organizationId}/projects/${task.projectId}`}
							className="line-clamp-1 cursor-pointer text-muted-foreground text-sm transition-colors hover:text-accent-foreground"
						>
							{task.project.name}
						</Link>
						<DotIcon className="size-4 shrink-0 text-muted-foreground" />
						<span className="shrink-0 text-muted-foreground text-sm">
							{formatDistanceToNow(task.createdAt, {
								addSuffix: true,
								locale: fnsLocale[locale],
							})}
						</span>
					</div>
				</div>
			</div>
		</>
	);
};

interface DashboardTaskCardSkeletonProps {
	isFirst?: boolean;
}

export const DashboardTaskCardSkeleton = ({
	isFirst,
}: DashboardTaskCardSkeletonProps) => {
	return (
		<div className={cn('flex items-center gap-4 py-3', !isFirst && 'border-t')}>
			<Skeleton className="size-4 shrink-0 rounded-full" />
			<div className="flex h-12 flex-1 flex-col gap-1">
				<div className="flex flex-1 items-center justify-between gap-4">
					<Skeleton className="h-4 w-48" />
					<Skeleton className="h-5 w-16 rounded-full" />
				</div>
				<div className="flex items-center gap-1">
					<Skeleton className="h-3.5 w-24" />
					<DotIcon className="size-4 shrink-0 text-muted-foreground" />
					<Skeleton className="h-3.5 w-20" />
				</div>
			</div>
		</div>
	);
};
