import { useState } from 'react';

import { CheckSquareIcon, EyeIcon, EyeOffIcon, PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useReorderSubtasks } from '@/features/tasks/hooks/use-reorder-subtasks';
import type { Subtask, Task } from '@/features/tasks/types';

import { CreateSubtaskForm } from './create-subtask-form';
import { SubtaskItem } from './subtask-item';

interface SubtasksProps {
	subtasks: Task['subtasks'];
	taskId: string;
	permissions: Task['permissions'];
}

export const Subtasks = ({ subtasks, taskId, permissions }: SubtasksProps) => {
	const t = useTranslations();

	const reorderMutation = useReorderSubtasks();

	const [hideCompleted, setHideCompleted] = useState(false);
	const [isAdding, setIsAdding] = useState(false);

	const sorted = [...subtasks].sort((a, b) => a.position - b.position);
	const completedCount = subtasks.filter(s => s.completed).length;
	const total = subtasks.length;
	const progress = total > 0 ? Math.round((completedCount / total) * 100) : 0;

	const visibleSubtasks = hideCompleted
		? sorted.filter(s => !s.completed)
		: sorted;

	const handleMove = (subtask: Subtask, direction: 'up' | 'down') => {
		const idx = sorted.findIndex(s => s.id === subtask.id);

		const targetIdx = direction === 'up' ? idx - 1 : idx + 1;

		if (targetIdx < 0 || targetIdx >= sorted.length) return;

		const targetPosition = sorted[targetIdx].position;

		reorderMutation.mutate({
			subtaskId: subtask.id,
			newPosition: targetPosition,
		});
	};

	return (
		<div className="flex flex-col px-4 pt-4 lg:px-8 lg:pt-8">
			<div className="flex h-8 w-full items-center gap-2 text-muted-foreground">
				<CheckSquareIcon className="size-4" />
				<h2 className="font-semibold text-base">{t('common.subtasks')}</h2>
				{completedCount > 0 && (
					<Button
						size="xs"
						variant="secondary"
						onClick={() => setHideCompleted(prev => !prev)}
						className="ml-auto"
					>
						{hideCompleted ? (
							<>
								<EyeIcon />
								{t('tasks.subtask_show')}
							</>
						) : (
							<>
								<EyeOffIcon />
								{t('tasks.subtask_hide')}
							</>
						)}
					</Button>
				)}
			</div>
			{total > 0 ? (
				<>
					<div className="w-full">
						<span className="text-muted-foreground text-sm">{`${progress}%`}</span>
						<Progress value={progress} />
					</div>
					<div className="pt-2">
						{visibleSubtasks.map((subtask, idx) => (
							<SubtaskItem
								key={subtask.id}
								subtask={subtask}
								canEdit={permissions.canCreateTask}
								isFirst={idx === 0}
								isLast={idx === visibleSubtasks.length - 1}
								onMoveUp={() => handleMove(subtask, 'up')}
								onMoveDown={() => handleMove(subtask, 'down')}
							/>
						))}
					</div>
				</>
			) : (
				<p className="text-muted-foreground italic">
					{t('tasks.subtasks_empty')}
				</p>
			)}
			{permissions.canCreateTask && (
				<div className="pt-2">
					{isAdding ? (
						<CreateSubtaskForm
							taskId={taskId}
							onClose={() => setIsAdding(false)}
						/>
					) : (
						<Button
							size="sm"
							variant="secondary"
							onClick={() => setIsAdding(true)}
						>
							<PlusIcon />
							{t('tasks.subtask_add')}
						</Button>
					)}
				</div>
			)}
		</div>
	);
};

export const SubtasksSkeleton = () => (
	<div className="flex flex-col px-4 pt-4 lg:px-8 lg:pt-8">
		<div className="flex h-8 items-center gap-2">
			<Skeleton className="size-4" />
			<Skeleton className="h-4 w-20" />
		</div>
		<div className="flex flex-col gap-1">
			<Skeleton className="mt-2 h-2 w-full" />
			{Array.from({ length: 3 }).map((_, i) => (
				<div key={i} className="flex items-center gap-2 px-2 py-1.5">
					<Skeleton className="size-4 shrink-0 rounded-sm" />
					<Skeleton className="h-4" style={{ width: `${60 + i * 10}%` }} />
				</div>
			))}
		</div>
	</div>
);
