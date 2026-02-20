import { relations } from 'drizzle-orm';
import {
	boolean,
	foreignKey,
	pgTable,
	text,
	timestamp,
} from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';

import { commentReactions } from './comment-reactions';
import { tasks } from './tasks';
import { user } from './user';

export const comments = pgTable(
	'comments',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => nanoid()),
		content: text('content').notNull(),
		parentId: text('parent_id'),
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
	},
	t => {
		return [
			foreignKey({
				columns: [t.parentId],
				foreignColumns: [t.id],
				name: 'comments_parent_id_fkey',
			}).onDelete('cascade'),
		];
	},
);

export const commentsRelations = relations(comments, ({ one, many }) => ({
	user: one(user, {
		fields: [comments.userId],
		references: [user.id],
	}),
	task: one(tasks, {
		fields: [comments.taskId],
		references: [tasks.id],
	}),
	reactions: many(commentReactions),
	parent: one(comments, {
		fields: [comments.parentId],
		references: [comments.id],
		relationName: 'comments_parent_id_fkey',
	}),
	replies: many(comments, {
		relationName: 'comments_parent_id_fkey',
	}),
}));
