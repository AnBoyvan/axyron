import { relations } from 'drizzle-orm';
import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';

import { activities } from './activities';
import { projectStatus, visibilityType } from './enums';
import { organizations } from './organizations';
import { projectMembers } from './project-members';
import { tasks } from './tasks';

export const projects = pgTable('projects', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
	name: text('name').notNull(),
	description: text('description'),
	visibility: visibilityType('visibility').notNull().default('private'),
	organizationId: text('organization_id')
		.notNull()
		.references(() => organizations.id, { onDelete: 'cascade' }),
	archived: boolean('archived').notNull().default(false),
	status: projectStatus('status').notNull().default('pending'),
	createdAt: timestamp('created_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const projectRelations = relations(projects, ({ one, many }) => ({
	organization: one(organizations, {
		fields: [projects.organizationId],
		references: [organizations.id],
	}),
	members: many(projectMembers),
	tasks: many(tasks),
	activities: many(activities),
}));
