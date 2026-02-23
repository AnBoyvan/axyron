import { useTranslations } from 'next-intl';

import { useProject } from '../../hooks/use-project';
import { ProjectHeader } from './project-header';

interface ProjectOverviewProps {
	projectId: string;
}

export const ProjectOverview = ({ projectId }: ProjectOverviewProps) => {
	const t = useTranslations();

	const { data } = useProject(projectId);

	return (
		<div className="flex flex-1 flex-col gap-4 lg:gap-8">
			<ProjectHeader
				projectId={projectId}
				orgId={data.organizationId}
				name={data.name}
				isArchived={data.archived}
				status={data.status}
				visibility={data.visibility}
				tab="overview"
			/>
		</div>
	);
};
