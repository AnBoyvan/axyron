import { useMemo } from 'react';

import { useLocale, useTranslations } from 'next-intl';

import { DataTable } from '@/components/shared/data-table';
import { projectTasksColumns } from '@/features/tasks/configs/project-tasks-columns';
import { useTasksByProject } from '@/features/tasks/hooks/use-tasks-by-projects';
import { useTasksFilters } from '@/features/tasks/hooks/use-tasks-filter';
import { TasksFilter } from '@/features/tasks/ui/components/tasks-filter';
import { getFilteredTasks } from '@/features/tasks/utils/get-filtered-tasks';

import { ProjectHeader } from './project-header';

interface ProjectTasksProps {
	projectId: string;
}

export const ProjectTasks = ({ projectId }: ProjectTasksProps) => {
	const t = useTranslations();
	const locale = useLocale();
	const [filters] = useTasksFilters();

	const {
		data: { tasks, project, permissions },
	} = useTasksByProject(projectId);

	const columns = useMemo(() => projectTasksColumns(t, locale), [t, locale]);

	const filteredTasks = useMemo(
		() => getFilteredTasks({ tasks, filters }),
		[tasks, filters],
	);

	return (
		<div className="flex flex-1 flex-col gap-4 lg:gap-8">
			<ProjectHeader
				projectId={projectId}
				orgId={project.organizationId}
				name={project.name}
				isArchived={project.archived}
				status={project.status}
				visibility={project.visibility}
				tab="tasks"
			/>
			<TasksFilter
				projectId={projectId}
				canCreate={permissions.canCreateTask}
			/>
			<DataTable
				data={filteredTasks}
				columns={columns}
				placeholder={t('tasks.no_tasks')}
			/>
		</div>
	);
};
