import { useState } from 'react';

import { PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { SearchFilter } from '@/components/shared/search-filter';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

import { useTasksFilters } from '../../hooks/use-tasks-filter';
import { NewTaskDialog } from './new-task-dialog';
import { TasksAssigneeFilter } from './tasks-assignee-filter';
import { TasksDueDateFilter } from './tasks-due-date-filter';
import { TasksPriorityFilter } from './tasks-priority-filter';
import { TasksStatusFilter } from './tasks-status-filter';

interface TasksFilterProps {
	projectId: string;
	canCreate?: boolean;
	className?: string;
}

export const TasksFilter = ({
	projectId,
	canCreate,
	className,
}: TasksFilterProps) => {
	const t = useTranslations();
	const [{ search, status, assignee, priority, dueDateTo }, setFilters] =
		useTasksFilters();

	const [open, setOpen] = useState(false);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex justify-between gap-4">
				<SearchFilter
					value={search}
					onChange={value => setFilters({ search: value })}
				/>
				{canCreate && (
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
			</div>
			<div className={cn('grid grid-cols-2 gap-4 lg:grid-cols-4', className)}>
				<TasksStatusFilter
					value={status}
					onChange={value => setFilters({ status: value })}
				/>
				<TasksPriorityFilter
					value={priority}
					onChange={value => setFilters({ priority: value })}
				/>
				<TasksAssigneeFilter
					projectId={projectId}
					value={assignee}
					onChange={value => setFilters({ assignee: value })}
				/>
				<TasksDueDateFilter
					value={dueDateTo}
					onChange={value => setFilters({ dueDateTo: value })}
				/>
			</div>
		</div>
	);
};
