import { useMemo, useState } from 'react';

import { useTranslations } from 'next-intl';

import { useTasksByUser } from '@/features/tasks/hooks/use-tasks-by-user';
import { useTasksFilters } from '@/features/tasks/hooks/use-tasks-filter';
import { MobileTasksFilter } from '@/features/tasks/ui/components/mobile-tasks-filter';
import { TaskPreview } from '@/features/tasks/ui/components/task-preview';
import { TasksFilter } from '@/features/tasks/ui/components/tasks-filter';
import { getFilteredTasks } from '@/features/tasks/utils/get-filtered-tasks';

interface UserTasksSectionProps {
	orgId: string;
}

export const UserTasksSection = ({ orgId }: UserTasksSectionProps) => {
	const t = useTranslations();
	const { filters } = useTasksFilters();

	const {
		data: { assigned, created },
	} = useTasksByUser({ orgId });

	const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

	const selectedTask =
		[...assigned, ...created].find(t => t.id === selectedTaskId) ?? null;

	const filteredTasks = useMemo(
		() =>
			getFilteredTasks({
				tasks: filters.variant === 'created' ? created : assigned,
				filters,
			}),
		[assigned, created, filters],
	);

	const projects = useMemo(
		() => [
			...new Map(
				[...assigned, ...created].map(task => [task.project.id, task.project]),
			).values(),
		],
		[assigned, created],
	);

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
				<h1 className="text-xl">{t('users.my_tasks')}</h1>
				<div className="lg:hidden">
					<MobileTasksFilter showVariant showProjects projects={projects} />
				</div>
				<div className="hidden lg:block">
					<TasksFilter showVariant showProjects projects={projects} />
				</div>
				{/* <DataTable
                  data={filteredTasks}
                  columns={columns}
                  defaultPageSize={DEFAULT_TASKS_TABLE_PAGE_SIZE}
                  placeholder={t('tasks.no_tasks')}
                  pageSizeVariants={TASKS_TABLE_PAGE_SIZES}
                  onRowClick={row => setSelectedTaskId(row.id)}
                /> */}
			</div>
		</>
	);
};
