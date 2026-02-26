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
import {
	ProjectTasksStats,
	ProjectTasksStatsSkeleton,
} from '../components/project-tasks-stats';
import {
	ProjectTasksStatsMobile,
	ProjectTasksStatsMobileSkeleton,
} from '../components/project-tasks-stats-mobile';

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
			<div className="grid grid-cols-5 gap-4 lg:gap-8">
				<div className="col-span-5 flex flex-col gap-4 lg:col-span-4 lg:gap-8">
					<div className="w-full lg:hidden">
						<ProjectTasksStatsMobile data={data.tasks} />
					</div>
					<ProjectInfo project={data} />
					<ProjectMembers project={data} />
					{isAdmin && (
						<ProjectDangerZone projectId={data.id} isArchived={data.archived} />
					)}
				</div>
				<div className="col-span-1 hidden w-full lg:block">
					<ProjectTasksStats data={data.tasks} />
				</div>
			</div>
		</div>
	);
};

export const ProjectOverviewSectionSkeleton = () => {
	return (
		<div className="flex flex-1 flex-col gap-4 lg:gap-8">
			<ProjectHeaderSkeleton tab="overview" />
			<div className="grid grid-cols-5 gap-4 lg:gap-8">
				<div className="col-span-5 flex flex-col gap-4 lg:col-span-4 lg:gap-8">
					<div className="w-full lg:hidden">
						<ProjectTasksStatsMobileSkeleton />
					</div>
					<ProjectInfoSkeleton />
					<ProjectMembersSkeleton />
				</div>
				<div className="col-span-1 hidden w-full lg:block">
					<ProjectTasksStatsSkeleton />
				</div>
			</div>
		</div>
	);
};
