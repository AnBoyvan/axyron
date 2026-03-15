import { useEffect, useRef, useState } from 'react';

import { PencilIcon } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

interface MeetingInlineFieldProps {
	value: string;
	onSave: (value: string) => void;
	canEdit: boolean;
	placeholder?: string;
	multiline?: boolean;
	className?: string;
}

export const MeetingInlineField = ({
	value,
	onSave,
	canEdit,
	placeholder,
	multiline = false,
	className,
}: MeetingInlineFieldProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const [draft, setDraft] = useState(value);
	const ref = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

	useEffect(() => {
		setDraft(value);
	}, [value]);

	useEffect(() => {
		if (isEditing) {
			ref.current?.focus();
			ref.current?.select();
		}
	}, [isEditing]);

	const handleSave = () => {
		const trimmed = draft.trim();
		if (trimmed && trimmed !== value) onSave(trimmed);
		else setDraft(value);
		setIsEditing(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !multiline) handleSave();
		if (e.key === 'Escape') {
			setDraft(value);
			setIsEditing(false);
		}
	};

	if (isEditing) {
		const sharedProps = {
			ref,
			value: draft,
			onChange: (
				e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
			) => setDraft(e.target.value),
			onBlur: handleSave,
			onKeyDown: handleKeyDown,
			className: cn(
				'w-full rounded-md border bg-background px-2 py-1 text-sm outline-none ring-2 ring-primary',
				multiline && 'min-h-20 resize-none',
				className,
			),
		};

		return multiline ? (
			<textarea
				{...sharedProps}
				ref={ref as React.RefObject<HTMLTextAreaElement>}
			/>
		) : (
			<input {...sharedProps} ref={ref as React.RefObject<HTMLInputElement>} />
		);
	}

	return (
		<div
			onClick={() => canEdit && setIsEditing(true)}
			className={cn(
				'group relative rounded-md px-2 py-1 text-sm',
				canEdit && 'cursor-pointer hover:bg-accent/50',
				className,
			)}
		>
			{value || (
				<span className="text-muted-foreground italic">{placeholder}</span>
			)}
			{canEdit && (
				<PencilIcon className="absolute top-2 right-2 size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
			)}
		</div>
	);
};
