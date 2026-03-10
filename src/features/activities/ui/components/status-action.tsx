import { useTranslations } from 'next-intl';

import { projectStatusTextColor } from '@/features/projects/configs/project-status-options';
import type { ProjectStatusType } from '@/features/projects/types';
import { taskStatuses } from '@/features/tasks/configs/task-status-options';
import type { DbTaskStatus } from '@/features/tasks/types';
import { cn } from '@/lib/utils/cn';

import type { Activity, ActivityMeta } from '../../types';

interface StatusActionProps {
	activity: Activity;
}

export const StatusAction = ({ activity }: StatusActionProps) => {
	const t = useTranslations();
	const meta = activity.meta as ActivityMeta | null;

	if (activity.entityType === 'project') {
		const fromStatus = meta?.from as ProjectStatusType;
		const toStatus = meta?.to as ProjectStatusType;

		return (
			<>
				{t.rich('activities.action.status_project', {
					from: t(`projects.statuses.${fromStatus}`),
					to: t(`projects.statuses.${toStatus}`),
					fromTag: chunks => (
						<span className={cn(projectStatusTextColor[fromStatus])}>
							{chunks}
						</span>
					),
					toTag: chunks => (
						<span className={cn(projectStatusTextColor[toStatus])}>
							{chunks}
						</span>
					),
				})}
			</>
		);
	}

	if (activity.entityType === 'subtask') {
		return (
			<>
				{t.rich('activities.action.status_subtask', {
					status: t(
						meta?.completed
							? 'tasks.subtask_status.completed'
							: 'tasks.subtask_status.incompleted',
					),
					b: chunks => (
						<span
							className={cn(
								meta?.completed
									? 'text-emerald-600 dark:text-emerald-400'
									: 'text-red-600 dark:text-red-500',
							)}
						>
							{chunks}
						</span>
					),
				})}
			</>
		);
	}

	if (activity.entityType === 'task') {
		const fromStatus = meta?.from as DbTaskStatus;
		const toStatus = meta?.to as DbTaskStatus;

		return (
			<>
				{t.rich('activities.action.status_task', {
					from: t(`tasks.statuses.${fromStatus}`),
					to: t(`tasks.statuses.${toStatus}`),
					fromTag: chunks => (
						<span className={cn(taskStatuses[fromStatus].iconStyle)}>
							{chunks}
						</span>
					),
					toTag: chunks => (
						<span className={cn(taskStatuses[toStatus].iconStyle)}>
							{chunks}
						</span>
					),
				})}
			</>
		);
	}

	return null;
};
