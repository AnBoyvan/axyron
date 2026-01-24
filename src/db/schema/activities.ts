import { relations } from 'drizzle-orm';
import { jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';

import { actionType, entityType } from './enums';
import { projects } from './projects';
import { tasks } from './tasks';
import { user } from './user';

export const activities = pgTable('activities', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
	projectId: text('project_id')
		.notNull()
		.references(() => projects.id, {
			onDelete: 'cascade',
		}),
	taskId: text('task_id').references(() => tasks.id, {
		onDelete: 'cascade',
	}),
	authorId: text('author_id')
		.notNull()
		.references(() => user.id, { onDelete: 'no action' }),
	entityId: text('entity_id').notNull(),
	entityType: entityType('entity_type').notNull(),
	action: actionType('action').notNull(),
	meta: jsonb('meta'),
	createdAt: timestamp('created_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const activityRelations = relations(activities, ({ one }) => ({
	project: one(projects, {
		fields: [activities.projectId],
		references: [projects.id],
	}),
	task: one(tasks, {
		fields: [activities.taskId],
		references: [tasks.id],
	}),
	author: one(user, {
		fields: [activities.authorId],
		references: [user.id],
	}),
}));
