import { ORG_DASHBOARD_TASKS_LIMIT } from '@/features/tasks/constants';
import { useTasksByUser } from '@/features/tasks/hooks/use-tasks-by-user';

import {
	DashboardTasks,
	DashboardTasksSkeleton,
} from '../components/dashboard-tasks';

interface DashboardUserTasksSectionProps {
	orgId: string;
}

export const DashboardUserTasksSection = ({
	orgId,
}: DashboardUserTasksSectionProps) => {
	const {
		data: { assigned, created },
	} = useTasksByUser({
		orgId,
		limit: ORG_DASHBOARD_TASKS_LIMIT,
	});

	return (
		<div className="col-span-1 flex flex-col gap-4 lg:col-span-2 lg:gap-8">
			<DashboardTasks tasks={assigned} variant="assigned" orgId={orgId} />
			<DashboardTasks tasks={created} variant="created" orgId={orgId} />
		</div>
	);
};

export const DashboardUserTasksSectionSkeleton = () => {
	return (
		<div className="col-span-1 flex flex-col gap-4 lg:col-span-2 lg:gap-8">
			<DashboardTasksSkeleton />
			<DashboardTasksSkeleton />
		</div>
	);
};
