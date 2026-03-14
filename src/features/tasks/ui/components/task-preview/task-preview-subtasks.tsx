import { useTranslations } from 'next-intl';

import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import type { Task } from '@/features/tasks/types';

import { TaskPreviewSubtaskItem } from '../task-details/task-preview-subtask-item';

interface TaskPreviewSubtasksProps {
	subtasks: Task['subtasks'];
	canEdit?: boolean;
}

export const TaskPreviewSubtasks = ({
	subtasks,
	canEdit,
}: TaskPreviewSubtasksProps) => {
	const t = useTranslations();

	const sorted = [...subtasks].sort((a, b) => a.position - b.position);
	const completedCount = subtasks.filter(s => s.completed).length;
	const total = subtasks.length;
	const progress = total > 0 ? Math.round((completedCount / total) * 100) : 0;

	if (total === 0) return null;

	return (
		<>
			<Separator />
			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
						{t('common.subtasks')} ({completedCount}/{total})
					</p>
					<span className="text-muted-foreground text-xs">{progress}%</span>
				</div>
				<Progress value={progress} className="h-1.5" />
				<div className="flex flex-col">
					{sorted.map(subtask => (
						<TaskPreviewSubtaskItem
							key={subtask.id}
							subtask={subtask}
							canEdit={canEdit}
						/>
					))}
				</div>
			</div>
		</>
	);
};
