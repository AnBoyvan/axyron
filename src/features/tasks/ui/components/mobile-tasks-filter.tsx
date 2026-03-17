import { useState } from 'react';

import { FilterIcon, FilterXIcon, PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
	SearchFilter,
	SearchFilterSkeleton,
} from '@/components/shared/search-filter';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
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
import { Skeleton } from '@/components/ui/skeleton';

interface MobileTasksFilterProps {
	projectId?: string;
	canCreate?: boolean;
	showVariant?: boolean;
	showProjects?: boolean;
	showOrgs?: boolean;
	projects?: Task['project'][];
	organizations?: Task['organization'][];
}

export const MobileTasksFilter = ({
	projectId,
	canCreate = false,
	showVariant = false,
	showProjects,
	showOrgs,
	projects = [],
	organizations = [],
}: MobileTasksFilterProps) => {
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
		resetFilters,
	} = useTasksFilters();

	const [open, setOpen] = useState(false);
	const [newOpen, setNewOpen] = useState(false);

	const isFiltered =
		Boolean(search) ||
		Boolean(status) ||
		Boolean(assignee) ||
		Boolean(priority) ||
		Boolean(dueDateTo) ||
		Boolean(project) ||
		Boolean(organization);

	const isBothButtons = canCreate && projectId;

	const onReset = () => {
		resetFilters();
		setOpen(false);
	};

	return (
		<div
			className={cn(
				'flex flex-col gap-4 md:flex-row',
				!isBothButtons && 'flex-row',
			)}
		>
			<SearchFilter
				value={search}
				placeholder={t('common.search_placeholder')}
				onChange={value => setFilters({ search: value })}
				className={cn(isBothButtons && 'w-full')}
			/>
			<div
				className={cn(
					'gap-4 lg:ml-auto',
					isBothButtons && 'grid grid-cols-2',
					!isBothButtons && 'ml-auto',
				)}
			>
				{isBothButtons && (
					<>
						<NewTaskDialog
							projectId={projectId}
							open={newOpen}
							onOpenChange={setNewOpen}
						/>
						<Button onClick={() => setNewOpen(true)}>
							<PlusIcon />
							{t('tasks.new')}
						</Button>
					</>
				)}
				<Sheet open={open} onOpenChange={setOpen}>
					<SheetTrigger asChild>
						<Button
							variant="outline"
							className={cn(isFiltered && 'text-primary')}
						>
							<FilterIcon />
							{t('common.filters')}
						</Button>
					</SheetTrigger>
					<SheetContent aria-describedby={undefined}>
						<SheetHeader className="border-b">
							<SheetTitle>{t('tasks.filter_title')}</SheetTitle>
						</SheetHeader>
						<div className="flex flex-1 flex-col gap-4 px-4">
							{showVariant && (
								<>
									<TasksVariantFilter
										value={variant}
										onChange={value => setFilters({ variant: value })}
									/>
									<Separator />
								</>
							)}
							{showOrgs && (
								<div className="flex flex-col gap-1.5">
									<Label>{t('common.organization')}</Label>
									<TasksOrgsFilter
										organizations={organizations}
										value={organization}
										onChange={value => setFilters({ organization: value })}
									/>
								</div>
							)}
							{showProjects && (
								<div className="flex flex-col gap-1.5">
									<Label>{t('common.project')}</Label>
									<TasksProjectsFilter
										projects={projects}
										value={project}
										onChange={value => setFilters({ project: value })}
									/>
								</div>
							)}
							<div className="flex flex-col gap-1.5">
								<Label>{t('common.status')}</Label>
								<TasksStatusFilter
									value={status}
									onChange={value => setFilters({ status: value })}
								/>
							</div>
							<div className="flex flex-col gap-1.5">
								<Label>{t('common.priority')}</Label>
								<TasksPriorityFilter
									value={priority}
									onChange={value => setFilters({ priority: value })}
								/>
							</div>
							{projectId && (
								<div className="flex flex-col gap-1.5">
									<Label>{t('common.assigned')}</Label>
									<TasksAssigneeFilter
										projectId={projectId}
										value={assignee}
										onChange={value => setFilters({ assignee: value })}
									/>
								</div>
							)}
							<div className="flex flex-col gap-1.5">
								<Label>{t('common.due_date')}</Label>
								<TasksDueDateFilter
									value={dueDateTo}
									onChange={value => setFilters({ dueDateTo: value })}
								/>
							</div>
							<Separator />
							<div className="grid grid-cols-2 gap-4">
								<Button onClick={() => setOpen(false)}>
									<FilterIcon />
									{t('actions.filter')}
								</Button>
								<Button variant="secondary" onClick={onReset}>
									<FilterXIcon />
									{t('actions.reset')}
								</Button>
							</div>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</div>
	);
};

export const MobileTasksFilterSkeleton = () => {
	return (
		<div className="flex flex-col gap-4 md:flex-row md:justify-between">
			<SearchFilterSkeleton />
			<Skeleton className="" />
		</div>
	);
};
