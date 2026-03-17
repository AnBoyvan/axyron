export const TASKS_TABLE_PAGE_SIZES = [5, 10, 25, 50];

export const DEFAULT_TASKS_TABLE_PAGE_SIZE = 25;

export const ORG_DASHBOARD_TASKS_LIMIT = 5;

export const USER_DASHBOARD_TASKS_LIMIT = 5;

export const TASK_STATUS_KEYS = [
	'overdue',
	'completed',
	'in_review',
	'in_progress',
	'pending',
	'cancelled',
] as const;

export const TASK_PRIORITY_KEYS = [
	'critical',
	'high',
	'medium',
	'low',
] as const;
