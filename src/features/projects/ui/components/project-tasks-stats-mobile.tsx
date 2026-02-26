import { ListTodoIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { taskStatusOptions } from '@/features/tasks/configs/task-status-options';
import { cn } from '@/lib/utils/cn';

import type { ProjectById } from '../../types';

interface ProjectTasksStatsMobileProps {
	data: ProjectById['tasks'];
}

export const ProjectTasksStatsMobile = ({
	data,
}: ProjectTasksStatsMobileProps) => {
	const t = useTranslations();

	const reversedOptions = [...taskStatusOptions].reverse();

	return (
		<div className="grid w-full grid-cols-12 gap-2">
			<div className="col-span-4 flex flex-col gap-2 rounded-md border bg-card p-2">
				<p className="truncate font-semibold text-sm">{t('tasks.total')}</p>
				<div className="flex h-6 items-center gap-2">
					<ListTodoIcon className="size-4" />
					<p>{data.total}</p>
				</div>
			</div>
			{reversedOptions.map((option, idx) => (
				<div
					key={option.value}
					className={cn(
						'flex flex-col gap-2 rounded-md border bg-card p-2',
						idx > 1 ? 'col-span-3' : 'col-span-4',
					)}
				>
					<p className="truncate font-semibold text-sm">{t(option.label)}</p>
					<div className="flex h-6 items-center gap-2">
						<option.icon className={cn('size-4', option.iconStyle)} />
						<p>{data[option.value]}</p>
					</div>
				</div>
			))}
		</div>
	);
};

export const ProjectTasksStatsMobileSkeleton = () => {
	const t = useTranslations();

	const reversedOptions = [...taskStatusOptions].reverse();

	return (
		<div className="grid w-full grid-cols-12 gap-2">
			<div className="col-span-4 flex flex-col gap-2 rounded-md border bg-card p-2">
				<p className="truncate font-semibold text-sm">{t('tasks.total')}</p>
				<div className="flex h-6 items-center gap-2">
					<ListTodoIcon className="size-4" />
				</div>
			</div>
			{reversedOptions.map((option, idx) => (
				<div
					key={option.value}
					className={cn(
						'flex flex-col gap-2 rounded-md border bg-card p-2',
						idx > 1 ? 'col-span-3' : 'col-span-4',
					)}
				>
					<p className="truncate font-semibold text-sm">{t(option.label)}</p>
					<div className="flex h-6 items-center gap-2">
						<option.icon className={cn('size-4', option.iconStyle)} />
					</div>
				</div>
			))}
		</div>
	);
};
