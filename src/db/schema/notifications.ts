import { relations } from 'drizzle-orm';
import { boolean, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';

import { notificationActionType, notificationEntityType } from './enums';
import { organizations } from './organizations';
import { user } from './user';

export const notifications = pgTable('notifications', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	createdBy: text('created_by').references(() => user.id, {
		onDelete: 'no action',
	}),
	organizationId: text('organization_id')
		.notNull()
		.references(() => organizations.id, { onDelete: 'cascade' }),
	entityId: text('entity_id').notNull(),
	entityType: notificationEntityType('entity_type').notNull(),
	action: notificationActionType('action').notNull(),
	read: boolean('read').notNull().default(false),
	meta: jsonb('meta'),
	createdAt: timestamp('created_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const notificationRelations = relations(notifications, ({ one }) => ({
	user: one(user, {
		fields: [notifications.userId],
		references: [user.id],
	}),
	createdBy: one(user, {
		fields: [notifications.createdBy],
		references: [user.id],
	}),
	organization: one(organizations, {
		fields: [notifications.organizationId],
		references: [organizations.id],
	}),
}));
