import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Meeting } from '@/features/meetings/types';
import { taskPriority } from '@/features/tasks/configs/task-priority-options';
import { taskStatuses } from '@/features/tasks/configs/task-status-options';
import type { Task } from '@/features/tasks/types';
import { resolveTaskStatus } from '@/features/tasks/utils/resolve-task-status';

import type { CalendarEvent } from '../types';
import { MeetingTooltip } from './meeting-tooltip';
import { TaskTooltip } from './task-tooltip';

interface EventComponentProps {
	event: CalendarEvent;
	style?: React.CSSProperties;
}

export const EventComponent = ({ event }: EventComponentProps) => {
	const isMeeting = event.type === 'meeting';
	const task = !isMeeting ? (event.resource as Task) : null;
	const meeting = isMeeting ? (event.resource as Meeting) : null;

	const resolvedStatus = task
		? resolveTaskStatus({ status: task.status, dueDate: task.dueDate })
		: null;

	const statusColor = resolvedStatus
		? taskStatuses[resolvedStatus]?.oklch
		: null;
	const priorityColor = task ? taskPriority[task.priority]?.oklch : null;
	const isFinished =
		task?.status === 'completed' || task?.status === 'cancelled';

	const eventEl = isMeeting ? (
		<div className="flex w-full items-center gap-1 truncate rounded bg-violet-600 px-1.5 py-0.5">
			<span className="size-1.5 shrink-0 rounded-sm bg-white/70" />
			<span className="truncate font-medium text-white text-xs">
				{event.title}
			</span>
		</div>
	) : (
		<div
			className="flex w-full items-center truncate rounded py-0.5 pr-1.5 pl-0"
			style={{
				backgroundColor: priorityColor ?? undefined,
				borderLeft: `8px solid ${statusColor}`,
				opacity: isFinished ? 0.7 : 1,
			}}
		>
			<span className="truncate pl-1.5 font-medium text-white text-xs">
				{event.title}
			</span>
		</div>
	);

	return (
		<TooltipProvider delayDuration={300}>
			<Tooltip>
				<TooltipTrigger asChild>{eventEl}</TooltipTrigger>
				<TooltipContent
					side="top"
					className="max-w-56 p-3"
					onClick={e => e.stopPropagation()}
				>
					{meeting && <MeetingTooltip meeting={meeting} />}
					{task && <TaskTooltip task={task} />}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};
