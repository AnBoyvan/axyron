import { relations } from 'drizzle-orm';
import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { activities } from './activities';
import { assignees } from './assignees';
import { comments } from './comments';
import { meetingComments } from './meeting-comments';
import { meetingMembers } from './meeting-members';
import { notifications } from './notifications';
import { organizationMembers } from './organization-members';
import { projectMembers } from './project-members';
import { tasks } from './tasks';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	position: text('position'),
	phone: text('phone'),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified')
		.$defaultFn(() => false)
		.notNull(),
	image: text('image'),
	createdAt: timestamp('created_at', { withTimezone: true })
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const organizationRelations = relations(user, ({ many }) => ({
	organizationMembers: many(organizationMembers),
	projectsMembers: many(projectMembers),
	createdTasks: many(tasks),
	assignees: many(assignees),
	comments: many(comments),
	activities: many(activities),
	meetingMembers: many(meetingMembers),
	meetingComments: many(meetingComments),
	notifications: many(notifications),
}));
