import { ClipboardListIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import type { TasksFilters } from '../../hooks/use-tasks-filter';
import type { Task } from '../../types';

interface TasksProjectsFilterProps {
	projects: Task['project'][];
	value: TasksFilters['project'];
	onChange: (value: TasksFilters['project']) => void;
}

export const TasksProjectsFilter = ({
	projects,
	value,
	onChange,
}: TasksProjectsFilterProps) => {
	const t = useTranslations();

	const onProjectsChange = (projectId: string) => {
		onChange(projectId === 'all' ? null : projectId);
	};

	return (
		<Select defaultValue={value ?? undefined} onValueChange={onProjectsChange}>
			<SelectTrigger className="w-full">
				<div className="flex items-center overflow-hidden pr-2">
					<ClipboardListIcon className="mr-2 size-4" />
					<SelectValue placeholder={t('projects.all')} />
				</div>
			</SelectTrigger>
			<SelectContent align="center" position="popper">
				<SelectItem key="all" value="all">
					{t('projects.all')}
				</SelectItem>
				<SelectSeparator />
				{projects.map(project => (
					<SelectItem key={project.id} value={project.id}>
						<span className="line-clamp-1">{project.name}</span>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};
