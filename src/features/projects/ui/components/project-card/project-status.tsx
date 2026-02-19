import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import type { Project } from '@/features/projects/types';
import { cn } from '@/lib/utils/cn';

interface ProjectStatusProps {
	isArchived?: boolean;
	status: Project['status'];
}

export const ProjectStatus = ({ isArchived, status }: ProjectStatusProps) => {
	const t = useTranslations();

	const statusTheme = {
		active:
			'text-green-700 border-green-700 bg-green-500/5 dark:text-green-500 dark:border-green-500',
		closed:
			'text-red-700 border-red-700 bg-red-500/5 dark:text-red-400 dark:border-red-400',
		pending:
			'text-sky-700 border-sky-700 bg-sky-500/5 dark:text-sky-400 dark:border-sky-400',
	};

	if (isArchived) {
		return (
			<Badge
				variant="outline"
				className="ml-auto bg-muted text-muted-foreground"
			>
				Archived
			</Badge>
		);
	}

	return (
		<Badge
			variant="outline"
			className={cn(
				'ml-auto bg-muted text-muted-foreground',
				statusTheme[status],
			)}
		>
			{t(`projects.statuses.${status}`)}
		</Badge>
	);
};
