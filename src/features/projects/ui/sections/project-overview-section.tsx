import { useProject } from '../../hooks/use-project';
import { ProjectDangerZone } from '../components/project-danger-zone';
import {
	ProjectHeader,
	ProjectHeaderSkeleton,
} from '../components/project-header';
import { ProjectInfo, ProjectInfoSkeleton } from '../components/project-info';
import {
	ProjectMembers,
	ProjectMembersSkeleton,
} from '../components/project-members';

interface ProjectOverviewSectionProps {
	projectId: string;
}

export const ProjectOverviewSection = ({
	projectId,
}: ProjectOverviewSectionProps) => {
	const { data } = useProject(projectId);

	const isAdmin =
		data.permissions.isOrgAdmin || data.permissions.isProjectAdmin;

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
			<ProjectInfo project={data} />
			<ProjectMembers project={data} />
			{isAdmin && (
				<ProjectDangerZone projectId={data.id} isArchived={data.archived} />
			)}
		</div>
	);
};

export const ProjectOverviewSectionSkeleton = () => {
	return (
		<div className="flex flex-1 flex-col gap-4 lg:gap-8">
			<ProjectHeaderSkeleton tab="overview" />
			<ProjectInfoSkeleton />
			<ProjectMembersSkeleton />
		</div>
	);
};
