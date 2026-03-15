import { format } from 'date-fns';
import { CalendarClockIcon, ClockIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { Skeleton } from '@/components/ui/skeleton';
import { fnsLocale } from '@/i18n/config';
import { formatDuration } from '@/lib/utils/format-duration';

import type { Meeting } from '../../types';
import { MeetingDatePicker } from './meeting-date-picker';
import { MeetingDurationSelect } from './meeting-duration-select';

interface MeetingDatetimeProps {
	meeting: Meeting;
	canEdit: boolean;
	onUpdate: (data: { startTime?: Date; duration?: number }) => void;
}

export const MeetingDatetime = ({
	meeting,
	canEdit,
	onUpdate,
}: MeetingDatetimeProps) => {
	const t = useTranslations();
	const locale = useLocale();

	return (
		<div className="flex flex-wrap gap-6">
			<div className="flex flex-col gap-1.5">
				<div className="flex items-center gap-1.5 text-muted-foreground">
					<CalendarClockIcon className="size-4" />
					<span className="font-medium text-xs uppercase tracking-wide">
						{t('common.start_time')}
					</span>
				</div>
				{canEdit ? (
					<MeetingDatePicker
						value={meeting.startTime}
						onChange={startTime => onUpdate({ startTime })}
					/>
				) : (
					<span className="text-sm">
						{format(meeting.startTime, 'PPP - HH:mm', {
							locale: fnsLocale[locale],
						})}
					</span>
				)}
			</div>

			<div className="flex flex-col gap-1.5">
				<div className="flex items-center gap-1.5 text-muted-foreground">
					<ClockIcon className="size-4" />
					<span className="font-medium text-xs uppercase tracking-wide">
						{t('common.duration')}
					</span>
				</div>
				{canEdit ? (
					<MeetingDurationSelect
						value={meeting.duration}
						onChange={duration => onUpdate({ duration })}
					/>
				) : (
					<span className="text-sm">
						{formatDuration(meeting.duration, fnsLocale[locale])}
					</span>
				)}
			</div>
		</div>
	);
};

export const MeetingDatetimeSkeleton = () => {
	return (
		<div className="flex gap-6">
			<div className="flex flex-col gap-2">
				<Skeleton className="h-3.5 w-20" />
				<Skeleton className="h-9 w-48" />
			</div>
			<div className="flex flex-col gap-2">
				<Skeleton className="h-3.5 w-16" />
				<Skeleton className="h-9 w-32" />
			</div>
		</div>
	);
};
