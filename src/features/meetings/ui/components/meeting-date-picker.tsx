import { useState } from 'react';

import { format } from 'date-fns';
import { CalendarCheckIcon, ChevronDownIcon } from 'lucide-react';
import { useLocale } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { fnsLocale } from '@/i18n/config';

interface MeetingDatePickerProps {
	value: Date;
	onChange: (date: Date) => void;
	disabled?: boolean;
}

export const MeetingDatePicker = ({
	value,
	onChange,
	disabled,
}: MeetingDatePickerProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const locale = useLocale();

	const handleDateSelect = (date: Date | undefined) => {
		if (!date) return;
		const next = new Date(date);
		next.setHours(value.getHours(), value.getMinutes(), 0, 0);
		onChange(next);
	};

	const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const [hours, minutes] = e.target.value.split(':').map(Number);
		const next = new Date(value);
		next.setHours(hours, minutes, 0, 0);
		onChange(next);
	};

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="select"
					disabled={disabled}
					className="w-full justify-start px-3 font-normal"
				>
					<CalendarCheckIcon className="shrink-0" />
					<span className="truncate text-foreground">
						{format(value, 'PPP - HH:mm', { locale: fnsLocale[locale] })}
					</span>
					<ChevronDownIcon className="ml-auto shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar
					mode="single"
					selected={value}
					onSelect={handleDateSelect}
					locale={fnsLocale[locale]}
				/>
				<div className="border-t p-3">
					<Input
						type="time"
						value={format(value, 'HH:mm')}
						onChange={handleTimeChange}
						className="w-full"
					/>
				</div>
			</PopoverContent>
		</Popover>
	);
};
