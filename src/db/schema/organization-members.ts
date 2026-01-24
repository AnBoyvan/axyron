import { relations } from 'drizzle-orm';
import {
	boolean,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from 'drizzle-orm/pg-core';

import { memberRole } from './enums';
import { organizations } from './organizations';
import { user } from './user';

export const organizationMembers = pgTable(
	'organization_members',
	{
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		organizationId: text('organization_id')
			.notNull()
			.references(() => organizations.id, { onDelete: 'cascade' }),
		role: memberRole('role').notNull().default('member'),
		canInvite: boolean('can_invite').notNull().default(false),
		canCreateProject: boolean('can_create_project').notNull().default(false),
		canCreateTask: boolean('can_create_task').notNull().default(false),
		canCreateMeeting: boolean('can_create_meeting').notNull().default(false),
		createdAt: timestamp('created_at', { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	t => [
		primaryKey({
			name: 'organization_members_pk',
			columns: [t.userId, t.organizationId],
		}),
	],
);

export const organizationMemberRelations = relations(
	organizationMembers,
	({ one }) => ({
		user: one(user, {
			fields: [organizationMembers.userId],
			references: [user.id],
		}),
		organization: one(organizations, {
			fields: [organizationMembers.organizationId],
			references: [organizations.id],
		}),
	}),
);
