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
		inviteCode: text('invite_code').notNull().unique(),
		invitedBy: text('invited_by').references(() => user.id, {
			onDelete: 'no action',
		}),
		canInvite: boolean('can_invite').notNull().default(false),
		canRemoveMember: boolean('can_remove_member').notNull().default(false),
		canUpdate: boolean('can_update').notNull().default(true),
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
		invitedBy: one(user, {
			fields: [organizationMembers.invitedBy],
			references: [user.id],
		}),
	}),
);

export const orgMemberSelectSchema = createSelectSchema(organizationMembers);
export type OrgMemberSelectSchema = z.infer<typeof orgMemberSelectSchema>;
