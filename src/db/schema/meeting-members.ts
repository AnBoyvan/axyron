import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';

import { acceptStatus } from './enums';
import { meetings } from './meetings';
import { user } from './user';

export const meetingMembers = pgTable(
	'meeting_members',
	{
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		meetingId: text('meeting_id')
			.notNull()
			.references(() => meetings.id, { onDelete: 'cascade' }),
		status: acceptStatus('status').notNull(),
		createdAt: timestamp('created_at', { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	t => [
		primaryKey({
			name: 'meeting_members_pk',
			columns: [t.userId, t.meetingId],
		}),
	],
);

export const meetingMemberRelations = relations(meetingMembers, ({ one }) => ({
	user: one(user, {
		fields: [meetingMembers.userId],
		references: [user.id],
	}),
	meeting: one(meetings, {
		fields: [meetingMembers.meetingId],
		references: [meetings.id],
	}),
}));
