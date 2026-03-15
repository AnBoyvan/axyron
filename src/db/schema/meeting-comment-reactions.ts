import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';

import { meetingComments } from './meeting-comments';
import { user } from './user';

export const meetingCommentReactions = pgTable(
	'meeting_comment_reactions',
	{
		commentId: text('comment_id')
			.notNull()
			.references(() => meetingComments.id, { onDelete: 'cascade' }),
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
			name: 'meeting_comment_reactions_pk',
			columns: [t.commentId, t.userId],
		}),
	],
);

export const meetingCommentReactionRelations = relations(
	meetingCommentReactions,
	({ one }) => ({
		user: one(user, {
			fields: [meetingCommentReactions.userId],
			references: [user.id],
		}),
		comment: one(meetingComments, {
			fields: [meetingCommentReactions.commentId],
			references: [meetingComments.id],
		}),
	}),
);
