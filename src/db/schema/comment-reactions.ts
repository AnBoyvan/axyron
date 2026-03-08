import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';

import { comments } from './comments';
import { user } from './user';

export const commentReactions = pgTable(
	'comment_reactions',
	{
		commentId: text('comment_id')
			.notNull()
			.references(() => comments.id, { onDelete: 'cascade' }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		emoji: text('emoji').notNull(),
		createdAt: timestamp('created_at', { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	t => [
		primaryKey({
			name: 'comment_reactions_pk',
			columns: [t.commentId, t.userId],
		}),
	],
);

export const commentReactionRelations = relations(
	commentReactions,
	({ one }) => ({
		user: one(user, {
			fields: [commentReactions.userId],
			references: [user.id],
		}),
		comment: one(comments, {
			fields: [commentReactions.commentId],
			references: [comments.id],
		}),
	}),
);
