import { ListTodoIcon } from 'lucide-react';

import { Field, FieldLabel } from '@/components/ui/field';
import { Progress } from '@/components/ui/progress';
import type { Project } from '@/features/projects/types';
import { getTasksProgress } from '@/features/tasks/utils/get-tasks-progress';

interface ProjectCardProgressProps {
	tasks: Project['tasks'];
}

export const ProjectCardProgress = ({ tasks }: ProjectCardProgressProps) => {
	const { completed, total, cancelled } = tasks;

	const { active, progress } = getTasksProgress({
		completed,
		total,
		cancelled,
	});

	return (
		<Field className="w-full gap-2">
			<FieldLabel htmlFor="progress-upload">
				<ListTodoIcon className="size-4 text-primary" />
				<span className="text-sm">
					{completed}&nbsp;/&nbsp;{active}
				</span>
				<span className="ml-auto">{progress}%</span>
			</FieldLabel>
			<Progress value={progress} id="progress-upload" />
		</Field>
	);
};
