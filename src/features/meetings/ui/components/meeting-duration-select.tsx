import { useLocale } from 'next-intl';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { fnsLocale } from '@/i18n/config';
import { formatDuration } from '@/lib/utils/format-duration';

import { MEETING_DURATION_OPTIONS } from '../../constants';

interface MeetingDurationSelectProps {
	value: number;
	onChange: (value: number) => void;
	disabled?: boolean;
}

export const MeetingDurationSelect = ({
	value,
	onChange,
	disabled,
}: MeetingDurationSelectProps) => {
	const locale = useLocale();
	const dateLocale = fnsLocale[locale];

	return (
		<Select
			disabled={disabled}
			value={String(value)}
			onValueChange={v => onChange(Number(v))}
		>
			<SelectTrigger>
				<SelectValue>{formatDuration(value, dateLocale)}</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{MEETING_DURATION_OPTIONS.map(option => (
					<SelectItem key={option.value} value={String(option.value)}>
						{formatDuration(option.value, dateLocale)}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};
