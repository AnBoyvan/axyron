import { useState } from 'react';

import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { SmilePlusIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface EmojiPickerProps {
	onSelect: (emoji: string) => void;
	disabled?: boolean;
}

export const EmojiPicker = ({ onSelect, disabled }: EmojiPickerProps) => {
	const { resolvedTheme } = useTheme();
	const [open, setOpen] = useState(false);

	const onEmojiSelect = (emoji: { native: string }) => {
		onSelect(emoji.native);
		setOpen(false);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					size="icon-sm"
					variant="ghost"
					className="text-muted-foreground"
					disabled={disabled}
				>
					<SmilePlusIcon className="size-4" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-fit border-none p-0 shadow-none"
				side="top"
				align="start"
			>
				<Picker
					data={data}
					theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
					onEmojiSelect={(e: { native: string }) => onEmojiSelect(e)}
					previewPosition="none"
					skinTonePosition="none"
				/>
			</PopoverContent>
		</Popover>
	);
};
