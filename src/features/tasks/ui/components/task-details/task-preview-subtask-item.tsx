import { Checkbox } from '@/components/ui/checkbox';
import { useToggleSubtask } from '@/features/tasks/hooks/use-toggle-subtask';
import type { Subtask } from '@/features/tasks/types';
import { cn } from '@/lib/utils/cn';

interface TaskPreviewSubtaskItemProps {
	subtask: Subtask;
	canEdit?: boolean;
}

export const TaskPreviewSubtaskItem = ({
	subtask,
	canEdit,
}: TaskPreviewSubtaskItemProps) => {
	const toggleSubtask = useToggleSubtask();

	return (
		<div className="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-accent/50">
			<Checkbox
				checked={subtask.completed}
				disabled={toggleSubtask.isPending || !canEdit}
				onCheckedChange={() => toggleSubtask.mutate({ subtaskId: subtask.id })}
				className="shrink-0"
			/>
			<span
				className={cn(
					'flex-1 text-sm',
					subtask.completed && 'text-muted-foreground line-through',
				)}
			>
				{subtask.title}
			</span>
		</div>
	);
};
