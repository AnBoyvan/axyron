import Link from 'next/link';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Skeleton } from '@/components/ui/skeleton';

import { type ProjectTab, projectTabs } from '../../configs/project-tabs';
import type { ProjectStatusType, ProjectVisibilityType } from '../../types';
import { ProjectStatus } from './project-status';
import { ProjectVisibility } from './project-visibility';

interface ProjectHeaderProps {
	tab: ProjectTab['value'];
	projectId: string;
	orgId: string;
	name: string;
	status: ProjectStatusType;
	isArchived: boolean;
	visibility: ProjectVisibilityType;
}

export const ProjectHeader = ({
	tab,
	projectId,
	orgId,
	name,
	status,
	isArchived,
	visibility,
}: ProjectHeaderProps) => {
	const t = useTranslations();

	return (
		<div className="flex flex-col gap-4">
			<div className="flex gap-4">
				<ProjectVisibility visibility={visibility} />
				<h1 className="truncate font-semibold text-xl">{name}</h1>
				<div className="ml-auto">
					<ProjectStatus isArchived={isArchived} status={status} />
				</div>
			</div>
			<ButtonGroup className="grid w-full grid-cols-3">
				{projectTabs.map(item => (
					<Button
						key={item.value}
						asChild
						variant={item.value === tab ? 'default' : 'outline'}
					>
						<Link href={`/org/${orgId}/projects/${projectId}/${item.link}`}>
							<item.icon />
							<span className="hidden lg:block">{t(item.label)}</span>
						</Link>
					</Button>
				))}
			</ButtonGroup>
		</div>
	);
};

export const ProjectHeaderSkeleton = ({
	tab,
}: {
	tab: ProjectTab['value'];
}) => {
	const t = useTranslations();

	return (
		<div className="flex flex-col gap-4">
			<div className="flex h-7 items-center gap-4">
				<Skeleton className="size-5 rounded-full" />
				<Skeleton className="h-6 w-40" />
				<Skeleton className="ml-auto h-6 w-16 rounded-full" />
			</div>
			<ButtonGroup className="grid w-full grid-cols-3">
				{projectTabs.map(item => (
					<Button
						key={item.value}
						disabled
						variant={item.value === tab ? 'default' : 'outline'}
					>
						<item.icon />
						<span className="hidden lg:block">{t(item.label)}</span>
					</Button>
				))}
			</ButtonGroup>
		</div>
	);
};
