import Link from 'next/link';

import {
	ActivityIcon,
	ArrowLeftIcon,
	EllipsisVerticalIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import type { Task } from '../../types';
import { TaskMenu } from './task-menu';

interface TaskHeaderProps {
	task: Task;
	openActivities: (open: boolean) => void;
}

export const TaskHeader = ({ task, openActivities }: TaskHeaderProps) => {
	return (
		<div className="flex h-13 items-center gap-4 border-b px-4 py-2">
			<Button asChild size="icon" variant="ghost">
				<Link href={`/org/${task.organizationId}/projects/${task.projectId}`}>
					<ArrowLeftIcon />
				</Link>
			</Button>
			<span className="truncate">{task.permissions.project.name}</span>
			<div className="ml-auto flex gap-2">
				<div className="lg:hidden">
					<Button
						size="icon"
						variant="ghost"
						onClick={() => openActivities(true)}
					>
						<ActivityIcon />
					</Button>
				</div>
				<TaskMenu task={task} />
			</div>
		</div>
	);
};

export const TaskHeaderSkeleton = () => (
	<div className="flex items-center gap-4 border-b px-4 py-2">
		<div className="flex size-9 items-center justify-center">
			<ArrowLeftIcon className="size-4 text-muted-foreground" />
		</div>
		<Skeleton className="h-4 w-32" />
		<div className="ml-auto flex gap-2">
			<div className="flex size-9 items-center justify-center lg:hidden">
				<ActivityIcon className="size-4 text-muted-foreground" />
			</div>
			<div className="flex size-9 items-center justify-center">
				<EllipsisVerticalIcon className="size-4 text-muted-foreground" />
			</div>
		</div>
	</div>
);
