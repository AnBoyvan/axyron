import { useState } from 'react';

import { PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
	SearchFilter,
	SearchFilterSkeleton,
} from '@/components/shared/search-filter';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils/cn';

import { useTasksFilters } from '../../hooks/use-tasks-filter';
import type { Task } from '../../types';
import { NewTaskDialog } from './new-task-dialog';
import { TasksOrgsFilter } from './task-orgs-filter';
import { TasksProjectsFilter } from './task-projects-filter';
import { TasksVariantFilter } from './task-variant-filter';
import { TasksAssigneeFilter } from './tasks-assignee-filter';
import { TasksDueDateFilter } from './tasks-due-date-filter';
import { TasksPriorityFilter } from './tasks-priority-filter';
import { TasksStatusFilter } from './tasks-status-filter';

interface TasksFilterProps {
	projectId?: string;
	canCreate?: boolean;
	className?: string;
	showVariant?: boolean;
	showProjects?: boolean;
	showOrgs?: boolean;
	projects?: Task['project'][];
	organizations?: Task['organization'][];
}

export const TasksFilter = ({
	projectId,
	canCreate = false,
	className,
	showVariant = false,
	showProjects,
	showOrgs,
	projects = [],
	organizations = [],
}: TasksFilterProps) => {
	const t = useTranslations();
	const {
		filters: {
			search,
			status,
			assignee,
			priority,
			dueDateTo,
			variant,
			project,
			organization,
		},
		setFilters,
	} = useTasksFilters();

	const [open, setOpen] = useState(false);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex justify-between gap-4">
				<SearchFilter
					value={search}
					placeholder={t('common.search_placeholder')}
					onChange={value => setFilters({ search: value })}
				/>
				{canCreate && projectId && (
					<>
						<NewTaskDialog
							projectId={projectId}
							open={open}
							onOpenChange={setOpen}
						/>
						<Button onClick={() => setOpen(true)}>
							<PlusIcon />
							{t('tasks.new')}
						</Button>
					</>
				)}
				{showVariant && (
					<TasksVariantFilter
						value={variant}
						onChange={value => setFilters({ variant: value })}
					/>
				)}
			</div>
			<div
				className={cn(
					'grid grid-cols-4 gap-4',
					showProjects && showOrgs && 'grid-cols-5',
					className,
				)}
			>
				{showOrgs && (
					<TasksOrgsFilter
						organizations={organizations}
						value={organization}
						onChange={value => setFilters({ organization: value })}
					/>
				)}
				{showProjects && (
					<TasksProjectsFilter
						projects={projects}
						value={project}
						onChange={value => setFilters({ project: value })}
					/>
				)}
				<TasksStatusFilter
					value={status}
					onChange={value => setFilters({ status: value })}
				/>
				<TasksPriorityFilter
					value={priority}
					onChange={value => setFilters({ priority: value })}
				/>
				{projectId && (
					<TasksAssigneeFilter
						projectId={projectId}
						value={assignee}
						onChange={value => setFilters({ assignee: value })}
					/>
				)}
				<TasksDueDateFilter
					value={dueDateTo}
					onChange={value => setFilters({ dueDateTo: value })}
				/>
			</div>
		</div>
	);
};

export const TasksFilterSkeleton = () => {
	return (
		<div className="flex flex-col gap-4">
			<SearchFilterSkeleton />
			<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
				{Array.from({ length: 4 }).map((_, idx) => (
					<Skeleton key={idx} className="h-9 w-full" />
				))}
			</div>
		</div>
	);
};
