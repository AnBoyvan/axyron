import Link from 'next/link';

import { ArrowRightIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ORG_DASHBOARD_TASKS_LIMIT } from '@/features/tasks/constants';
import type { Task } from '@/features/tasks/types';

import {
	DashboardTaskCard,
	DashboardTaskCardSkeleton,
} from './dashboard-task-card';

interface DashboardTasksProps {
	tasks: Task[];
	variant: 'assigned' | 'created';
	orgId: string;
}

export const DashboardTasks = ({
	tasks,
	variant,
	orgId,
}: DashboardTasksProps) => {
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
					<Link href={`/org/${orgId}/tasks?variant=${variant}`}>
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

export const DashboardTasksSkeleton = () => {
	return (
		<Card className="gap-2">
			<CardHeader className="flex items-center justify-between">
				<Skeleton className="h-5 w-40" />
				<Skeleton className="h-8 w-20" />
			</CardHeader>
			<CardContent>
				<div className="flex flex-col">
					{Array.from({ length: ORG_DASHBOARD_TASKS_LIMIT }).map((_, idx) => (
						<DashboardTaskCardSkeleton key={idx} isFirst={idx === 0} />
					))}
				</div>
			</CardContent>
		</Card>
	);
};
