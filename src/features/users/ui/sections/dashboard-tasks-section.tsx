import { USER_DASHBOARD_TASKS_LIMIT } from '@/features/tasks/constants';
import { useTasksByUser } from '@/features/tasks/hooks/use-tasks-by-user';

import {
	UserDashboardTasks,
	UserDashboardTasksSkeleton,
} from '../components/user-dashboard-tasks';

export const DashboardTasksSection = () => {
	const {
		data: { assigned, created },
	} = useTasksByUser({
		limit: USER_DASHBOARD_TASKS_LIMIT,
	});

	return (
		<div className="col-span-1 flex flex-col gap-4 lg:col-span-2 lg:gap-8">
			<UserDashboardTasks tasks={assigned} variant="assigned" />
			<UserDashboardTasks tasks={created} variant="created" />
		</div>
	);
};

export const DashboardTasksSectionSkeleton = () => {
	return (
		<div className="col-span-1 flex flex-col gap-4 lg:col-span-2 lg:gap-8">
			<UserDashboardTasksSkeleton />
			<UserDashboardTasksSkeleton />
		</div>
	);
};
