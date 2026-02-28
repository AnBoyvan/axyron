import { LoaderIcon } from 'lucide-react';

import { ChartMemberWithPriority } from '@/features/tasks/ui/charts/chart-member-with-priority';
import { ChartMemberWithStatus } from '@/features/tasks/ui/charts/chart-member-with-status';
import { ChartPriorityWithAssignees } from '@/features/tasks/ui/charts/chart-priority-with-assignees';
import { ChartPriorityWithStatus } from '@/features/tasks/ui/charts/chart-priority-with-status';
import { ChartStatusWithAssignees } from '@/features/tasks/ui/charts/chart-status-with-assignee';
import { ChartStatusWithPriority } from '@/features/tasks/ui/charts/chart-status-with-priority';

import { useProjectAnalytics } from '../../hooks/use-project-analytics';
import {
	ProjectHeader,
	ProjectHeaderSkeleton,
} from '../components/project-header';

interface ProjectAnalyticsSectionProps {
	projectId: string;
}

export const ProjectAnalyticsSection = ({
	projectId,
}: ProjectAnalyticsSectionProps) => {
	const { data } = useProjectAnalytics(projectId);

	return (
		<div className="flex flex-1 flex-col gap-4 lg:gap-8">
			<ProjectHeader
				projectId={projectId}
				orgId={data.project.organizationId}
				name={data.project.name}
				isArchived={data.project.archived}
				status={data.project.status}
				visibility={data.project.visibility}
				tab="analytics"
			/>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8 2xl:grid-cols-3">
				<ChartMemberWithStatus data={data.byMembers} />
				<div className="2xl:hidden">
					<ChartMemberWithPriority data={data.byMembers} />
				</div>
				<ChartStatusWithAssignees data={data.byStatus} />
				<ChartStatusWithPriority data={data.byStatus} />
				<div className="hidden 2xl:block">
					<ChartMemberWithPriority data={data.byMembers} />
				</div>
				<ChartPriorityWithAssignees data={data.byPriority} />
				<ChartPriorityWithStatus data={data.byPriority} />
			</div>
		</div>
	);
};

export const ProjectAnalyticsSectionSkeleton = () => {
	return (
		<div className="flex flex-1 flex-col gap-4 lg:gap-8">
			<ProjectHeaderSkeleton tab="analytics" />
			<div className="flex flex-1 items-center justify-center">
				<LoaderIcon className="size-6 animate-spin text-muted-foreground" />
			</div>
		</div>
	);
};
