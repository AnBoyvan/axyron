import { pgEnum } from 'drizzle-orm/pg-core';

export const organizationPlan = pgEnum('organization_plan', [
	'free',
	'basic',
	'pro',
]);

export const memberRole = pgEnum('member_role', ['admin', 'member']);

export const visibilityType = pgEnum('visibility_type', ['private', 'public']);

export const projectStatus = pgEnum('project_status', [
	'pending',
	'active',
	'closed',
]);

export const taskPriority = pgEnum('task_priority', [
	'low',
	'medium',
	'high',
	'critical',
]);

export const taskStatus = pgEnum('task_status', [
	'pending',
	'in_progress',
	'in_review',
	'completed',
	'cancelled',
]);

export const entityType = pgEnum('entity_type', [
	'project',
	'task',
	'subtask',
	'user',
]);

export const actionType = pgEnum('action_type', [
	'created',
	'renamed',
	'deleted',
	'assigned',
	'unassigned',
	'status',
	'priority',
	'start_date',
	'due_date',
	'archived',
	'restored',
	'visibility',
]);

export const acceptStatus = pgEnum('accept_status', [
	'pending',
	'accepted',
	'rejected',
]);

export const notificationEntityType = pgEnum('notification_entity_type', [
	'project',
	'task',
	'meeting',
]);

export const notificationActionType = pgEnum('notification_action_type', [
	'added',
	'removed',
	'admin_granted',
	'admin_revoked',
	'assigned',
	'unassigned',
	'task_status',
]);
