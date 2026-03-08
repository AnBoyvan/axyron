import { useEffect, useRef, useState } from 'react';

import { ArrowDownIcon, ArrowUpIcon, Trash2Icon, XIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useRemoveSubtask } from '@/features/tasks/hooks/use-remove-subtask';
import { useToggleSubtask } from '@/features/tasks/hooks/use-toggle-subtask';
import { useUpdateSubtask } from '@/features/tasks/hooks/use-update-subtask';
import type { Subtask } from '@/features/tasks/types';
import { cn } from '@/lib/utils/cn';

interface SubtaskItemProps {
	subtask: Subtask;
	canEdit: boolean;
	isFirst: boolean;
	isLast: boolean;
	onMoveUp: () => void;
	onMoveDown: () => void;
}

export const SubtaskItem = ({
	subtask,
	canEdit,
	isFirst,
	isLast,
	onMoveUp,
	onMoveDown,
}: SubtaskItemProps) => {
	const t = useTranslations();
	const toggleMutation = useToggleSubtask();
	const removeMutation = useRemoveSubtask();
	const updateMutation = useUpdateSubtask();

	const [isEditing, setIsEditing] = useState(false);
	const [editValue, setEditValue] = useState(subtask.title);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isEditing) {
			inputRef.current?.focus();
			inputRef.current?.select();
		}
	}, [isEditing]);

	const handleCancel = () => {
		setEditValue(subtask.title);
		setIsEditing(false);
	};

	const handleSave = () => {
		const trimmed = editValue.trim();
		if (!trimmed || trimmed === subtask.title) {
			setEditValue(subtask.title);
			setIsEditing(false);
			return;
		}
		updateMutation.mutate(
			{ subtaskId: subtask.id, title: trimmed },
			{ onSuccess: () => setIsEditing(false) },
		);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') handleSave();
		if (e.key === 'Escape') {
			setEditValue(subtask.title);
			setIsEditing(false);
		}
	};

	if (isEditing) {
		return (
			<div className="flex flex-col gap-2 rounded-md px-2 py-1.5">
				<Input
					ref={inputRef}
					value={editValue}
					onChange={e => setEditValue(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder={t('tasks.subtask_placeholder')}
					disabled={updateMutation.isPending}
				/>
				<div className="flex items-center gap-2">
					<Button
						size="sm"
						onClick={handleSave}
						disabled={!editValue.trim() || updateMutation.isPending}
					>
						{t('actions.save')}
					</Button>
					<Button size="icon-sm" variant="ghost" onClick={handleCancel}>
						<XIcon />
					</Button>
					<div className="ml-auto flex items-center gap-2">
						<Button
							disabled={isFirst}
							size="icon-sm"
							variant="ghost"
							title={t('actions.move_up')}
							onClick={() => onMoveUp()}
						>
							<ArrowUpIcon />
						</Button>
						<Button
							disabled={isLast}
							size="icon-sm"
							variant="ghost"
							title={t('actions.move_down')}
							onClick={() => onMoveDown()}
						>
							<ArrowDownIcon />
						</Button>
						<Button
							size="icon-sm"
							variant="ghost"
							className="text-destructive hover:text-destructive"
							disabled={removeMutation.isPending}
							onClick={() => removeMutation.mutate({ subtaskId: subtask.id })}
						>
							<Trash2Icon />
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-accent/50">
			<Checkbox
				checked={subtask.completed}
				disabled={toggleMutation.isPending || !canEdit}
				onCheckedChange={() => toggleMutation.mutate({ subtaskId: subtask.id })}
				className="shrink-0"
			/>
			<span
				onClick={() => canEdit && setIsEditing(true)}
				className={cn(
					'flex-1 text-sm',
					subtask.completed && 'text-muted-foreground line-through',
					canEdit && 'cursor-pointer',
				)}
			>
				{subtask.title}
			</span>
		</div>
	);
};
