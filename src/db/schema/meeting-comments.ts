import { relations } from 'drizzle-orm';
import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';

import { meetings } from './meetings';
import { user } from './user';

export const meetingComments = pgTable('meeting_comments', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
	content: text('content').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	meetingId: text('meeting_id')
		.notNull()
		.references(() => meetings.id, {
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

export const meetingCommentsRelations = relations(
	meetingComments,
	({ one }) => ({
		user: one(user, {
			fields: [meetingComments.userId],
			references: [user.id],
		}),
		meeting: one(meetings, {
			fields: [meetingComments.meetingId],
			references: [meetings.id],
		}),
	}),
);
