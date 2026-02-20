import { useMemo } from 'react';

import { useTranslations } from 'next-intl';

import { useProjectsByOrg } from '../../hooks/use-projects-by-org';
import { ProjectCard } from './project-card';

interface OrgProjectsListProps {
	orgId: string;
	search?: string;
}

export const OrgProjectsList = ({ orgId, search }: OrgProjectsListProps) => {
	const t = useTranslations();

	const { data } = useProjectsByOrg(orgId);

	const projects = useMemo(
		() =>
			data.filter(item => {
				if (search) {
					return item.name.toLowerCase().includes(search.toLowerCase());
				}
				return item;
			}),
		[data],
	);

	return (
		<>
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
		</>
	);
};
