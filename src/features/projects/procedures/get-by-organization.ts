import { TRPCError } from '@trpc/server';
import { and, eq, getTableColumns, isNotNull, lt, or, sql } from 'drizzle-orm';
import z from 'zod';

import { db } from '@/db';
import { organizationMembers } from '@/db/schema/organization-members';
import { projectMembers } from '@/db/schema/project-members';
import { projects } from '@/db/schema/projects';
import { tasks } from '@/db/schema/tasks';
import { user } from '@/db/schema/user';
import { protectedProcedure } from '@/trpc/init';

import type { ProjectMemberDTO } from '../types';

export const getByOrganization = protectedProcedure
	.input(z.object({ organizationId: z.string() }))
	.query(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [existingOrgMember] = await db
			.select()
			.from(organizationMembers)
			.where(
				and(
					eq(organizationMembers.userId, userId),
					eq(organizationMembers.organizationId, input.organizationId),
				),
			)
			.limit(1);

		if (!existingOrgMember) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'projects.not_found',
			});
		}

		const members = db.$with('members').as(
			db
				.select({
					role: projectMembers.role,
					name: user.name,
					image: user.image,
					email: user.email,
					phone: user.phone,
					userId: user.id,
					projectId: projectMembers.projectId,
				})
				.from(projectMembers)
				.innerJoin(user, eq(user.id, projectMembers.userId))
				.where(eq(projectMembers.projectId, projects.id)),
		);

		const data = await db
			.with(members)
			.select({
				...getTableColumns(projects),
				userAsMember: projectMembers,
				members: sql<ProjectMemberDTO[]>`
                 coalesce(
                 json_agg(${members}.*)
                 filter (where ${members}.userId is not null),
                '[]'
                 )
                `.as('members'),
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
						and(
							eq(tasks.projectId, projects.id),
							eq(tasks.status, 'in_review'),
						),
					),
					completed: db.$count(
						tasks,
						and(
							eq(tasks.projectId, projects.id),
							eq(tasks.status, 'completed'),
						),
					),
					cancelled: db.$count(
						tasks,
						and(
							eq(tasks.projectId, projects.id),
							eq(tasks.status, 'cancelled'),
						),
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
			.leftJoin(members, eq(members.projectId, projects.id))
			.where(
				and(
					eq(projects.organizationId, input.organizationId),
					eq(projects.archived, false),
					existingOrgMember.role !== 'admin'
						? or(
								eq(projects.visibility, 'public'),
								isNotNull(projectMembers.userId),
							)
						: undefined,
				),
			);

		return data;
	});
