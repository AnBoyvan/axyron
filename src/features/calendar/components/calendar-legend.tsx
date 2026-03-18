import { useTranslations } from 'next-intl';

import { taskPriorityOptions } from '@/features/tasks/configs/task-priority-options';
import { taskStatuses } from '@/features/tasks/configs/task-status-options';

import { MEETING_COLOR } from '../utils/get-event-style';

export const CalendarLegend = () => {
	const t = useTranslations();

	return (
		<div className="flex flex-wrap items-center gap-4 text-muted-foreground text-xs">
			<div className="flex items-center gap-1.5">
				<div
					className="size-2.5 rounded-full"
					style={{ backgroundColor: MEETING_COLOR }}
				/>
				{t('common.meeting')}
			</div>
			{taskPriorityOptions.map(p => (
				<div key={p.value} className="flex items-center gap-1.5">
					<div
						className="size-2.5 rounded-full"
						style={{ backgroundColor: p.oklch }}
					/>
					{t(p.label)}
				</div>
			))}
			<div className="flex items-center gap-1.5">
				<div
					className="size-2.5 rounded-full"
					style={{ backgroundColor: taskStatuses.overdue.oklch }}
				/>
				{t(taskStatuses.overdue.label)}
			</div>
		</div>
	);
};
