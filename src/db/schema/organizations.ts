import { relations } from 'drizzle-orm';
import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { nanoid } from 'nanoid';
import type z from 'zod';

import { meetings } from './meetings';
import { organizationMembers } from './organization-members';
import { projects } from './projects';
import { tasks } from './tasks';

export const organizations = pgTable('organizations', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
	name: text('name').notNull(),
	image: text('image'),
	description: text('description'),
	canInvite: boolean('can_invite').notNull().default(true),
	canCreateProject: boolean('can_create_project').notNull().default(true),
	canCreateTask: boolean('can_create_task').notNull().default(true),
	canCreateMeeting: boolean('can_create_meeting').notNull().default(true),
	createdAt: timestamp('created_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const organizationRelations = relations(organizations, ({ many }) => ({
	members: many(organizationMembers),
	projects: many(projects),
	tasks: many(tasks),
	meetings: many(meetings),
}));

export const organizationSelectSchema = createSelectSchema(organizations);
export type OrgSelectSchema = z.infer<typeof organizationSelectSchema>;
