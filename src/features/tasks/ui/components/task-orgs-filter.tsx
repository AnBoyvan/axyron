import { NetworkIcon } from 'lucide-react';
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

interface TasksOrgsFilterProps {
	organizations: Task['organization'][];
	value: TasksFilters['organization'];
	onChange: (value: TasksFilters['organization']) => void;
}

export const TasksOrgsFilter = ({
	organizations,
	value,
	onChange,
}: TasksOrgsFilterProps) => {
	const t = useTranslations();

	const onOrgChange = (projectId: string) => {
		onChange(projectId === 'all' ? null : projectId);
	};

	return (
		<Select defaultValue={value ?? undefined} onValueChange={onOrgChange}>
			<SelectTrigger className="w-full">
				<div className="flex items-center overflow-hidden pr-2">
					<NetworkIcon className="mr-2 size-4" />
					<SelectValue placeholder={t('orgs.all')} />
				</div>
			</SelectTrigger>
			<SelectContent align="center" position="popper" className="max-w-52">
				<SelectItem key="all" value="all">
					{t('orgs.all')}
				</SelectItem>
				<SelectSeparator />
				{organizations.map(organization => (
					<SelectItem key={organization.id} value={organization.id}>
						<span className="line-clamp-1">{organization.name}</span>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};
