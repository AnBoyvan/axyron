import { useEffect, useRef, useState } from 'react';

import { XIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateSubtask } from '@/features/tasks/hooks/use-create-subtask';

interface CreateSubtaskFormProps {
	taskId: string;
	onClose: () => void;
}

export const CreateSubtaskForm = ({
	taskId,
	onClose,
}: CreateSubtaskFormProps) => {
	const t = useTranslations();

	const [value, setValue] = useState('');

	const inputRef = useRef<HTMLInputElement>(null);

	const createSubtask = useCreateSubtask();

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	const handleSubmit = () => {
		const trimmed = value.trim();
		if (!trimmed) return;
		createSubtask.mutate(
			{ taskId, title: trimmed },
			{
				onSuccess: () => {
					setValue('');
					onClose();
				},
			},
		);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') handleSubmit();
		if (e.key === 'Escape') onClose();
	};

	return (
		<div className="flex flex-col items-center gap-2">
			<Input
				ref={inputRef}
				value={value}
				onChange={e => setValue(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder={t('tasks.subtask_placeholder')}
				disabled={createSubtask.isPending}
			/>
			<div className="flex w-full justify-start gap-4">
				<Button
					size="sm"
					onClick={handleSubmit}
					disabled={!value.trim() || createSubtask.isPending}
				>
					{t('actions.add')}
				</Button>
				<Button size="icon-sm" variant="ghost" onClick={onClose}>
					<XIcon />
				</Button>
			</div>
		</div>
	);
};
