import { relations } from 'drizzle-orm';
import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { nanoid } from 'nanoid';
import type z from 'zod';

import { activities } from './activities';
import { assignees } from './assignees';
import { comments } from './comments';
import { taskPriority, taskStatus } from './enums';
import { organizations } from './organizations';
import { projects } from './projects';
import { subtasks } from './subtasks';
import { user } from './user';

export const tasks = pgTable('tasks', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
	title: text('title').notNull(),
	description: text('description'),
	organizationId: text('organization_id')
		.notNull()
		.references(() => organizations.id, {
			onDelete: 'cascade',
		}),
	projectId: text('project_id')
		.notNull()
		.references(() => projects.id, {
			onDelete: 'cascade',
		}),
	createdBy: text('created_by')
		.notNull()
		.references(() => user.id, { onDelete: 'no action' }),
	priority: taskPriority('priority').notNull().default('low'),
	status: taskStatus('status').notNull().default('pending'),
	startDate: timestamp('start_date', { withTimezone: true }),
	dueDate: timestamp('due_date', { withTimezone: true }),
	needReview: boolean('need_review').notNull().default(false),
	createdAt: timestamp('created_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const taskSelectSchema = createSelectSchema(tasks);
export type TaskSelectSchema = z.infer<typeof taskSelectSchema>;

export const taskRelations = relations(tasks, ({ one, many }) => ({
	organization: one(organizations, {
		fields: [tasks.organizationId],
		references: [organizations.id],
	}),
	project: one(projects, {
		fields: [tasks.projectId],
		references: [projects.id],
	}),
	createdBy: one(user, {
		fields: [tasks.createdBy],
		references: [user.id],
	}),
	subtasks: many(subtasks),
	comments: many(comments),
	assignees: many(assignees),
	activities: many(activities),
}));
