import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';

import { tasks } from './tasks';
import { user } from './user';

export const assignees = pgTable(
	'assignees',
	{
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		taskId: text('task_id')
			.notNull()
			.references(() => tasks.id, {
				onDelete: 'cascade',
			}),
		createdAt: timestamp('created_at', { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	t => [
		primaryKey({
			name: 'assignee_pk',
			columns: [t.userId, t.taskId],
		}),
	],
);

export const assigneeRelations = relations(assignees, ({ one }) => ({
	user: one(user, {
		fields: [assignees.userId],
		references: [user.id],
	}),
	task: one(tasks, {
		fields: [assignees.taskId],
		references: [tasks.id],
	}),
}));
