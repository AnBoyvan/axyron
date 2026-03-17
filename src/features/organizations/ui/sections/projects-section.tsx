import { useMemo, useState } from 'react';

import { PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
	SearchFilter,
	SearchFilterSkeleton,
} from '@/components/shared/search-filter';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useProjectsByOrg } from '@/features/projects/hooks/use-projects-by-org';
import { NewProjectDialog } from '@/features/projects/ui/components/new-project-dialog';
import {
	ProjectCard,
	ProjectCardSkeleton,
} from '@/features/projects/ui/components/project-card';

interface ProjectsProps {
	orgId: string;
}

export const ProjectsSection = ({ orgId }: ProjectsProps) => {
	const t = useTranslations();

	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState('');

	const { data } = useProjectsByOrg(orgId);

	const projects = useMemo(
		() =>
			data.projects.filter(item => {
				if (search) {
					return item.name.toLowerCase().includes(search.toLowerCase());
				}
				return item;
			}),
		[data, search],
	);

	return (
		<>
			<NewProjectDialog open={open} onOpenChange={setOpen} orgId={orgId} />
			<div className="flex flex-1 flex-col gap-4 lg:gap-8">
				<div className="flex justify-between">
					<SearchFilter
						value={search}
						onChange={setSearch}
						placeholder={t('projects.search_placeholder')}
					/>
					{data.permissions.createProject && (
						<Button onClick={() => setOpen(true)}>
							<PlusIcon />
							{t('common.new')}
						</Button>
					)}
				</div>
				{projects.length > 0 ? (
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8 2xl:grid-cols-3">
						{projects.map(project => (
							<ProjectCard key={project.id} project={project} />
						))}
					</div>
				) : (
					<div className="flex flex-1 flex-col items-center justify-center text-muted-foreground">
						{t('projects.no_projects')}
					</div>
				)}
			</div>
		</>
	);
};

export const ProjectsSectionSkeleton = () => {
	return (
		<div className="flex flex-1 flex-col gap-4 lg:gap-8">
			<div className="flex justify-between">
				<SearchFilterSkeleton />
				<Skeleton className="h-9 w-20" />
			</div>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8 2xl:grid-cols-3">
				{Array.from({ length: 5 }).map((_, idx) => (
					<ProjectCardSkeleton key={idx} />
				))}
			</div>
		</div>
	);
};
