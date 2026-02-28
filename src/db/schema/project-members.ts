import { relations } from 'drizzle-orm';
import {
	boolean,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import type z from 'zod';

import { memberRole } from './enums';
import { projects } from './projects';
import { user } from './user';

export const projectMembers = pgTable(
	'project_members',
	{
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		projectId: text('project_id')
			.notNull()
			.references(() => projects.id, { onDelete: 'cascade' }),
		role: memberRole('role').notNull().default('member'),
		canInvite: boolean('can_invite').notNull().default(false),
		canCreateTask: boolean('can_create_task').notNull().default(false),
		createdAt: timestamp('created_at', { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	t => [
		primaryKey({
			name: 'project_members_pk',
			columns: [t.userId, t.projectId],
		}),
	],
);

export const projectMemberSelectSchema = createSelectSchema(projectMembers);
export type ProjectMemberSelectSchema = z.infer<
	typeof projectMemberSelectSchema
>;

export const projectMemberRelations = relations(projectMembers, ({ one }) => ({
	user: one(user, {
		fields: [projectMembers.userId],
		references: [user.id],
	}),
	project: one(projects, {
		fields: [projectMembers.projectId],
		references: [projects.id],
	}),
}));
