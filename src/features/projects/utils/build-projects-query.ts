import { and, eq, getTableColumns, isNotNull, lt, or, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

import { db } from '@/db';
import { projectMembers } from '@/db/schema/project-members';
import { projects } from '@/db/schema/projects';
import { tasks } from '@/db/schema/tasks';
import { user } from '@/db/schema/user';

import type { ProjectMemberDTO } from '../types';

const pm = alias(projectMembers, 'pm');
const u = alias(user, 'u');

interface BuildProjectsQueryParams {
	organizationId: string;
	userId: string;
	isAdmin: boolean;
	archived: boolean;
}

export const buildProjectsQuery = async ({
	organizationId,
	userId,
	isAdmin,
	archived,
}: BuildProjectsQueryParams) => {
	const rows = await db
		.select({
			...getTableColumns(projects),
			userAsMember: {
				userId: projectMembers.userId,
				projectId: projectMembers.projectId,
				role: projectMembers.role,
				canInvite: projectMembers.canInvite,
				canCreateTask: projectMembers.canCreateTask,
				createdAt: projectMembers.createdAt,
				updatedAt: projectMembers.updatedAt,
			},
			members: sql<ProjectMemberDTO[]>`
				coalesce(
					json_agg(
						json_build_object(
							'role',   ${pm.role},
							'name',   ${u.name},
							'image',  ${u.image},
							'email',  ${u.email},
							'phone',  ${u.phone},
							'userId', ${u.id}
						)
					) filter (where ${u.id} is not null),
					'[]'
				)
			`,
			tasks: {
				total: db.$count(tasks, eq(tasks.projectId, projects.id)),
				pending: db.$count(
					tasks,
					and(eq(tasks.projectId, projects.id), eq(tasks.status, 'pending')),
				),
				in_progress: db.$count(
					tasks,
					and(
						eq(tasks.projectId, projects.id),
						eq(tasks.status, 'in_progress'),
					),
				),
				in_review: db.$count(
					tasks,
					and(eq(tasks.projectId, projects.id), eq(tasks.status, 'in_review')),
				),
				completed: db.$count(
					tasks,
					and(eq(tasks.projectId, projects.id), eq(tasks.status, 'completed')),
				),
				cancelled: db.$count(
					tasks,
					and(eq(tasks.projectId, projects.id), eq(tasks.status, 'cancelled')),
				),
				overdue: db.$count(
					tasks,
					and(
						eq(tasks.projectId, projects.id),
						eq(tasks.status, 'in_progress'),
						lt(tasks.dueDate, sql`now()`),
					),
				),
			},
		})
		.from(projects)
		.leftJoin(
			projectMembers,
			and(
				eq(projectMembers.projectId, projects.id),
				eq(projectMembers.userId, userId),
			),
		)
		.leftJoin(pm, eq(pm.projectId, projects.id))
		.leftJoin(u, eq(u.id, pm.userId))
		.where(
			and(
				eq(projects.organizationId, organizationId),
				eq(projects.archived, archived),
				isAdmin
					? undefined
					: or(
							eq(projects.visibility, 'public'),
							isNotNull(projectMembers.userId),
						),
			),
		)
		.groupBy(
			projects.id,
			projectMembers.userId,
			projectMembers.projectId,
			projectMembers.role,
			projectMembers.canInvite,
			projectMembers.canCreateTask,
			projectMembers.createdAt,
			projectMembers.updatedAt,
		);

	return rows.map(row => ({
		...row,
		userAsMember: row?.userAsMember?.userId ? row.userAsMember : null,
	}));
};
