import { useMemo } from 'react';

import { useTranslations } from 'next-intl';

import { OrgAvatar } from '@/features/organizations/ui/components/org-avatar';
import type { ProjectsByOrg } from '@/features/projects/types';
import { ProjectCard } from '@/features/projects/ui/components/project-card';

interface UserProjectsByOrg {
	orgWithProjects: ProjectsByOrg;
	search: string;
}

export const UserProjectsByOrg = ({
	orgWithProjects,
	search,
}: UserProjectsByOrg) => {
	const t = useTranslations();

	const projects = useMemo(
		() =>
			orgWithProjects.projects.filter(item => {
				if (search) {
					return item.name.toLowerCase().includes(search.toLowerCase());
				}
				return item;
			}),
		[orgWithProjects, search],
	);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-2">
				<OrgAvatar
					imageUrl={orgWithProjects.image}
					name={orgWithProjects.name}
				/>
				<span className="font-semibold text-lg">{orgWithProjects.name}</span>
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
	);
};
