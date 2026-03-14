import { TRPCError } from '@trpc/server';
import { and, between, eq, getTableColumns, sql } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import { meetings } from '@/db/schema/meetings';
import { organizationMembers } from '@/db/schema/organization-members';
import { organizations } from '@/db/schema/organizations';
import { user } from '@/db/schema/user';
import { getOrgPermissions } from '@/features/organizations/utils/get-org-permission';
import { resolveDateRange } from '@/lib/utils/resolve-week-range';
import { protectedProcedure } from '@/trpc/init';

export const getByOrganization = protectedProcedure
	.input(
		z.object({
			organizationId: z.string(),
			dateFrom: z.coerce.date().optional(),
			dateTo: z.coerce.date().optional(),
		}),
	)
	.query(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [orgData] = await db
			.select({
				org: getTableColumns(organizations),
				member: getTableColumns(organizationMembers),
			})
			.from(organizations)
			.innerJoin(
				organizationMembers,
				and(
					eq(organizationMembers.organizationId, organizations.id),
					eq(organizationMembers.userId, userId),
				),
			)
			.where(eq(organizations.id, input.organizationId))
			.limit(1);

		if (!orgData) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'orgs.not_found',
			});
		}

		const permissions = getOrgPermissions({
			org: orgData.org,
			member: orgData.member,
		});

		const { dateFrom, dateTo } = resolveDateRange(input.dateFrom, input.dateTo);

		const data = await db
			.select({
				meeting: meetings,
				organization: {
					id: organizations.id,
					name: organizations.name,
					image: organizations.image,
				},
				creator: {
					id: user.id,
					name: user.name,
					email: user.email,
					image: user.image,
				},
				members: sql<
					{
						userId: string;
						name: string;
						email: string;
						image: string | null;
						status: 'pending' | 'accepted' | 'rejected';
					}[]
				>`
          coalesce(members.members, '[]'::json)
        `,
				commentsCount: sql<number>`
          coalesce(comments.count, 0)
        `,
			})
			.from(meetings)
			.innerJoin(organizations, eq(organizations.id, meetings.organizationId))
			.innerJoin(user, eq(user.id, meetings.createdBy))
			.leftJoin(
				sql`
          lateral (
            select json_agg(
              jsonb_build_object(
                'userId', u.id,
                'name', u.name,
                'email', u.email,
                'image', u.image,
                'status', mm.status
              )
              order by mm.created_at
            ) as members
            from meeting_members mm
            join "user" u on u.id = mm.user_id
            where mm.meeting_id = ${meetings.id}
          ) members
        `,
				sql`true`,
			)
			.leftJoin(
				sql`
          lateral (
            select count(*)::int as count
            from meeting_comments mc
            where mc.meeting_id = ${meetings.id}
          ) comments
        `,
				sql`true`,
			)
			.where(
				and(
					eq(meetings.organizationId, input.organizationId),
					between(meetings.startTime, dateFrom, dateTo),
					sql`
            exists (
              select 1
              from meeting_members mm
              where mm.meeting_id = ${meetings.id}
              and mm.user_id = ${userId}
            )
          `,
				),
			)
			.orderBy(meetings.startTime);

		return data.map(item => ({
			...item.meeting,
			organization: item.organization,
			creator: item.creator,
			members: item.members,
			commentsCount: item.commentsCount,
			isUserAdmin: permissions.isAdmin,
		}));
	});
