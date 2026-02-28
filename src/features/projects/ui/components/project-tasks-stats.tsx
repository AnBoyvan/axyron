import { ListTodoIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { taskStatusOptions } from '@/features/tasks/configs/task-status-options';
import { cn } from '@/lib/utils/cn';

import type { ProjectById } from '../../types';

interface ProjectTasksStatsProps {
	data: ProjectById['tasks'];
}

export const ProjectTasksStats = ({ data }: ProjectTasksStatsProps) => {
	const t = useTranslations();

	return (
		<div className="2xl flex w-full flex-col gap-8">
			<div className="flex flex-col gap-2 rounded-md border bg-card p-4">
				<p className="font-semibold">{t('tasks.total')}</p>
				<div className="flex h-9 items-center gap-4">
					<ListTodoIcon className={'size-8'} />
					<p className="text-3xl">{data.total}</p>
				</div>
			</div>
			{taskStatusOptions.map(option => {
				return (
					<div
						key={option.value}
						className="flex flex-col gap-2 rounded-md border bg-card p-4"
					>
						<p className="font-semibold">{t(option.label)}</p>
						<div className="flex h-9 items-center gap-4">
							<option.icon className={cn('size-8', option.iconStyle)} />
							<p className="text-3xl">{data[option.value]}</p>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export const ProjectTasksStatsSkeleton = () => {
	const t = useTranslations();

	return (
		<div className="2xl flex w-full flex-col gap-8">
			<div className="flex flex-col gap-2 rounded-md border bg-card p-4">
				<p className="font-semibold">{t('tasks.total')}</p>
				<div className="flex h-9 items-center gap-4">
					<ListTodoIcon className={'size-8'} />
				</div>
			</div>
			{taskStatusOptions.map(option => {
				return (
					<div
						key={option.value}
						className="flex flex-col gap-2 rounded-md border bg-card p-4"
					>
						<p className="font-semibold">{t(option.label)}</p>
						<div className="flex h-9 items-center gap-4">
							<option.icon className={cn('size-8', option.iconStyle)} />
						</div>
					</div>
				);
			})}
		</div>
	);
};
