import { format } from 'date-fns';
import { useLocale } from 'next-intl';

import type { Meeting } from '@/features/meetings/types';
import { fnsLocale } from '@/i18n/config';
import { formatDuration } from '@/lib/utils/format-duration';

interface MeetingTooltipProps {
	meeting: Meeting;
}

export const MeetingTooltip = ({ meeting }: MeetingTooltipProps) => {
	const locale = useLocale();
	const dateLocale = fnsLocale[locale];

	return (
		<div className="flex flex-col gap-1.5">
			<p className="font-medium">{meeting.title}</p>
			<p className="text-xs text-zinc-300 dark:text-zinc-600">
				{format(new Date(meeting.startTime), 'PPP - HH:mm', {
					locale: dateLocale,
				})}
			</p>
			<p className="text-xs text-zinc-300 dark:text-zinc-600">
				{formatDuration(meeting.duration, dateLocale)}
			</p>
		</div>
	);
};
