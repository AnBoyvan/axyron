import { relations } from 'drizzle-orm';
import {
	boolean,
	integer,
	pgTable,
	text,
	timestamp,
} from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';

import { tasks } from './tasks';

export const subtasks = pgTable('subtasks', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
	taskId: text('task_id')
		.notNull()
		.references(() => tasks.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	position: integer('position').notNull(),
	completed: boolean('completed').notNull().default(false),
	createdAt: timestamp('created_at', { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export const subtaskRelations = relations(subtasks, ({ one }) => ({
	task: one(tasks, {
		fields: [subtasks.taskId],
		references: [tasks.id],
	}),

	// TODO: logs
}));
