import Link from 'next/link';

import { ArrowRightIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { USER_DASHBOARD_TASKS_LIMIT } from '@/features/tasks/constants';
import type { Task } from '@/features/tasks/types';
import {
	DashboardTaskCard,
	DashboardTaskCardSkeleton,
} from '@/features/tasks/ui/components/dashboard-task-card';

interface UserDashboardTasksProps {
	tasks: Task[];
	variant: 'assigned' | 'created';
}

export const UserDashboardTasks = ({
	tasks,
	variant,
}: UserDashboardTasksProps) => {
	const t = useTranslations();

	return (
		<Card className="gap-2">
			<CardHeader className="flex items-center justify-between">
				<CardTitle className="text-lg">
					{t(
						variant === 'assigned'
							? 'tasks.assigned_to_me'
							: 'tasks.created_by_me',
					)}
				</CardTitle>
				<Button size="sm" variant="ghost" asChild>
					<Link href={`/user/tasks?variant=${variant}`}>
						{t('actions.view_all')}
						<ArrowRightIcon />
					</Link>
				</Button>
			</CardHeader>
			<CardContent>
				{tasks.length > 0 ? (
					<div className="flex flex-col">
						{tasks.map((task, idx) => (
							<DashboardTaskCard
								key={task.id}
								showOrg
								task={task}
								isFirst={idx === 0}
							/>
						))}
					</div>
				) : (
					<p className="text-muted-foreground italic">
						{t(
							variant === 'assigned'
								? 'tasks.assigned_to_me_empty'
								: 'tasks.created_by_me_empty',
						)}
					</p>
				)}
			</CardContent>
		</Card>
	);
};

export const UserDashboardTasksSkeleton = () => {
	return (
		<Card className="gap-2">
			<CardHeader className="flex items-center justify-between">
				<Skeleton className="h-5 w-40" />
				<Skeleton className="h-8 w-20" />
			</CardHeader>
			<CardContent>
				<div className="flex flex-col">
					{Array.from({ length: USER_DASHBOARD_TASKS_LIMIT }).map((_, idx) => (
						<DashboardTaskCardSkeleton key={idx} isFirst={idx === 0} />
					))}
				</div>
			</CardContent>
		</Card>
	);
};
