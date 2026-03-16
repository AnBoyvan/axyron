import { useMemo, useState } from 'react';

import { useLocale, useTranslations } from 'next-intl';

import { DataTable, DataTableSkeleton } from '@/components/shared/data-table';
import { projectTasksColumns } from '@/features/tasks/configs/project-tasks-columns';
import {
	DEFAULT_TASKS_TABLE_PAGE_SIZE,
	TASKS_TABLE_PAGE_SIZES,
} from '@/features/tasks/constants';
import { useTasksByProject } from '@/features/tasks/hooks/use-tasks-by-projects';
import { useTasksFilters } from '@/features/tasks/hooks/use-tasks-filter';
import { MobileTasksFilter } from '@/features/tasks/ui/components/mobile-tasks-filter';
import { TaskPreview } from '@/features/tasks/ui/components/task-preview';
import {
	TasksFilter,
	TasksFilterSkeleton,
} from '@/features/tasks/ui/components/tasks-filter';
import { getFilteredTasks } from '@/features/tasks/utils/get-filtered-tasks';

import {
	ProjectHeader,
	ProjectHeaderSkeleton,
} from '../components/project-header';

interface ProjectTasksSectionProps {
	projectId: string;
}

export const ProjectTasksSection = ({
	projectId,
}: ProjectTasksSectionProps) => {
	const t = useTranslations();
	const locale = useLocale();
	const { filters } = useTasksFilters();

	const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

	const {
		data: { tasks, project, permissions },
	} = useTasksByProject(projectId);

	const columns = useMemo(() => projectTasksColumns(t, locale), [t, locale]);

	const filteredTasks = useMemo(
		() => getFilteredTasks({ tasks, filters }),
		[tasks, filters],
	);

	const selectedTask = tasks.find(t => t.id === selectedTaskId) ?? null;
	return (
		<>
			{selectedTask && (
				<TaskPreview
					task={selectedTask}
					open={Boolean(selectedTask)}
					onOpenChange={open => !open && setSelectedTaskId(null)}
				/>
			)}
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
				<div className="lg:hidden">
					<MobileTasksFilter
						projectId={projectId}
						canCreate={permissions.canCreateTask}
					/>
				</div>
				<div className="hidden lg:block">
					<TasksFilter
						projectId={projectId}
						canCreate={permissions.canCreateTask}
					/>
				</div>

				<DataTable
					data={filteredTasks}
					columns={columns}
					defaultPageSize={DEFAULT_TASKS_TABLE_PAGE_SIZE}
					placeholder={t('tasks.no_tasks')}
					pageSizeVariants={TASKS_TABLE_PAGE_SIZES}
					onRowClick={row => setSelectedTaskId(row.id)}
				/>
			</div>
		</>
	);
};

export const ProjectTasksSectionSkeleton = () => {
	return (
		<div className="flex flex-1 flex-col gap-4 lg:gap-8">
			<ProjectHeaderSkeleton tab="tasks" />
			<TasksFilterSkeleton />
			<DataTableSkeleton defaultPageSize={DEFAULT_TASKS_TABLE_PAGE_SIZE} />
		</div>
	);
};
