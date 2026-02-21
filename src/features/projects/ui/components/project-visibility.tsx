import { Globe2Icon, LockKeyholeIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import type { ProjectVisibilityType } from '@/features/projects/types';
import { cn } from '@/lib/utils/cn';

interface ProjectVisibilityProps {
	visibility: ProjectVisibilityType;
	isLarge?: boolean;
}

export const ProjectVisibility = ({
	visibility,
	isLarge,
}: ProjectVisibilityProps) => {
	const t = useTranslations();

	return (
		<Tooltip>
			<TooltipTrigger>
				{visibility === 'public' ? (
					<Globe2Icon
						className={cn(
							isLarge ? 'size-5' : 'size-4',
							'text-muted-foreground',
						)}
					/>
				) : (
					<LockKeyholeIcon
						className={cn(
							isLarge ? 'size-5' : 'size-4',
							'text-muted-foreground',
						)}
					/>
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
