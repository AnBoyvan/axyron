import { relations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';

import { meetingComments } from './meeting-comments';
import { meetingMembers } from './meeting-members';
import { organizations } from './organizations';
import { user } from './user';

export const meetings = pgTable('meetings', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
	title: text('title').notNull(),
	description: text('description'),
	meetingUrl: text('meeting_url'),
	createdBy: text('created_by')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	startTime: timestamp('start_time', { withTimezone: true }).notNull(),
	duration: integer('duration').notNull(),
	organizationId: text('organization_id')
		.notNull()
		.references(() => organizations.id, {
			onDelete: 'cascade',
		}),
	createdAt: timestamp('created_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const meetingRelations = relations(meetings, ({ one, many }) => ({
	createdBy: one(user, {
		fields: [meetings.createdBy],
		references: [user.id],
	}),
	organization: one(organizations, {
		fields: [meetings.organizationId],
		references: [organizations.id],
	}),
	members: many(meetingMembers),
	meetingComments: many(meetingComments),
}));
