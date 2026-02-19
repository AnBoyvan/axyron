import { Globe2Icon, LockKeyholeIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Project } from '@/features/projects/types';

interface ProjectCardVisibilityProps {
	visibility: Project['visibility'];
}

export const ProjectCardVisibility = ({
	visibility,
}: ProjectCardVisibilityProps) => {
	const t = useTranslations();

	return (
		<Tooltip>
			<TooltipTrigger>
				{visibility === 'public' ? (
					<Globe2Icon className="size-4 text-muted-foreground" />
				) : (
					<LockKeyholeIcon className="size-4 text-muted-foreground" />
				)}
			</TooltipTrigger>
			<TooltipContent>
				<p>
					{visibility === 'public'
						? t('projects.public_tooltip')
						: t('projects.private_tooltip')}
				</p>
			</TooltipContent>
		</Tooltip>
	);
};
