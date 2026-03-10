import type { ActivitySelectSchema } from '@/db/schema/activities';

export type ActivityAction = ActivitySelectSchema['action'];

export type ActivityEntityType = ActivitySelectSchema['entityType'];

export interface ActivityMeta {
	from?: string;
	to?: string;
	title?: string;
	name?: string;
	completed?: boolean;
}

export interface ActivityAuthor {
	id: string;
	name: string;
	email: string;
	image: string | null;
}

export interface ActivityEntity {
	id: string | null;
	name?: string | null;
	title?: string | null;
	email?: string | null;
	image?: string | null;
}

export interface Activity {
	id: string;
	action: ActivityAction;
	entityType: ActivityEntityType;
	meta: unknown;
	createdAt: Date;
	author: ActivityAuthor | null;
	entity: ActivityEntity | null;
}
