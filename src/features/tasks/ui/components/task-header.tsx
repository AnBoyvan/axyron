import Link from 'next/link';

import { ActivityIcon, ArrowLeftIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { TaskById } from '../../types';
import { TaskMenu } from './task-menu';

interface TaskHeaderProps {
	task: TaskById;
}

export const TaskHeader = ({ task }: TaskHeaderProps) => {
	return (
		<div className="flex items-center gap-4 border-b px-4 py-2">
			<Button asChild size="icon" variant="ghost">
				<Link href={`/org/${task.organizationId}/projects/${task.projectId}`}>
					<ArrowLeftIcon />
				</Link>
			</Button>
			<span className="truncate">{task.permissions.project.name}</span>
			<div className="ml-auto flex gap-2">
				<div className="lg:hidden">
					<Button size="icon" variant="ghost">
						<ActivityIcon />
					</Button>
				</div>
				<TaskMenu task={task} />
			</div>
		</div>
	);
};
