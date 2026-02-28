import type { inferRouterOutputs } from '@trpc/server';

import type { AssigneeSelectSchema } from '@/db/schema/assignees';
import type { AppRouter } from '@/trpc/routers/_app';

export type TaskByProject =
	inferRouterOutputs<AppRouter>['tasks']['getByProject']['tasks'][number];

export enum TaskPrority {
	low = 'low',
	medium = 'medium',
	high = 'high',
	critical = 'critical',
}

export type DbTaskStatus =
	| 'pending'
	| 'in_progress'
	| 'in_review'
	| 'completed'
	| 'cancelled';

export enum TaskStatusEnum {
	pending = 'pending',
	in_progress = 'in_progress',
	in_review = 'in_review',
	completed = 'completed',
	cancelled = 'cancelled',
	overdue = 'overdue',
}

export enum TaskPriorityEnum {
	low = 'low',
	medium = 'medium',
	high = 'high',
	critical = 'critical',
}

export type Assignee = AssigneeSelectSchema & {
	name: string;
	image?: string | null;
};

export type AssigneeWithCount = Assignee & {
	count: number;
};
