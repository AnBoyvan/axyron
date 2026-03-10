import { useTranslations } from 'next-intl';

import { taskPriority } from '@/features/tasks/configs/task-priority-options';
import type { TaskPriorityEnum } from '@/features/tasks/types';
import { cn } from '@/lib/utils/cn';

import type { Activity, ActivityMeta } from '../../types';

interface PriorityActionProps {
	activity: Activity;
}

export const PriorityAction = ({ activity }: PriorityActionProps) => {
	const t = useTranslations();
	const meta = activity.meta as ActivityMeta | null;

	const fromPriority = meta?.from as TaskPriorityEnum;
	const toPriority = meta?.to as TaskPriorityEnum;

	return (
		<>
			{t.rich('activities.action.priority', {
				from: t(`tasks.priority.${fromPriority}`),
				to: t(`tasks.priority.${toPriority}`),
				fromTag: chunks => (
					<span className={cn(taskPriority[fromPriority].text)}>{chunks}</span>
				),
				toTag: chunks => (
					<span className={cn(taskPriority[toPriority].text)}>{chunks}</span>
				),
			})}
		</>
	);
};
