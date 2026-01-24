import { relations } from 'drizzle-orm';
import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';

import { tasks } from './tasks';
import { user } from './user';

export const comments = pgTable('comments', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
	content: text('content').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	taskId: text('task_id')
		.notNull()
		.references(() => tasks.id, {
			onDelete: 'cascade',
		}),
	edited: boolean('edited').notNull().default(false),
	createdAt: timestamp('created_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const commentsRelations = relations(comments, ({ one }) => ({
	user: one(user, {
		fields: [comments.userId],
		references: [user.id],
	}),
	task: one(tasks, {
		fields: [comments.taskId],
		references: [tasks.id],
	}),
}));
