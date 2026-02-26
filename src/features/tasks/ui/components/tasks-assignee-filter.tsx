import { LoaderIcon, UsersIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useProjectMembersForTask } from '@/features/projects/hooks/use-project-members-for-task';

import type { TasksFilters } from '../../hooks/use-tasks-filter';

interface TasksAssigneeFilterProps {
	projectId: string;
	value: TasksFilters['assignee'];
	onChange: (value: TasksFilters['assignee']) => void;
}

export const TasksAssigneeFilter = ({
	projectId,
	value,
	onChange,
}: TasksAssigneeFilterProps) => {
	const t = useTranslations();

	const { data } = useProjectMembersForTask(projectId);

	const onAssigneeChange = (userId: string) => {
		onChange(userId === 'all' ? null : (userId as TasksFilters['assignee']));
	};

	return (
		<Select defaultValue={value ?? undefined} onValueChange={onAssigneeChange}>
			<SelectTrigger className="w-full">
				<div className="flex items-center overflow-hidden pr-2">
					<UsersIcon className="mr-2 size-4" />
					<SelectValue placeholder={t('members.all')} />
				</div>
			</SelectTrigger>
			<SelectContent align="center" position="popper">
				{data ? (
					<>
						<SelectItem key="all" value="all">
							{t('members.all')}
						</SelectItem>
						<SelectSeparator />
						{data.map(member => (
							<SelectItem
								key={member.userId}
								value={member.userId}
								className="max-w-full truncate"
							>
								{member.name}
							</SelectItem>
						))}
					</>
				) : (
					<div className="flex h-48 items-center justify-center">
						<LoaderIcon className="size-6 animate-spin text-muted-foreground" />
					</div>
				)}
			</SelectContent>
		</Select>
	);
};
