import { and, eq, getTableColumns, or, type SQL, sql } from 'drizzle-orm';

import { db } from '@/db';
import { meetings } from '@/db/schema/meetings';
import { organizationMembers } from '@/db/schema/organization-members';
import { organizations } from '@/db/schema/organizations';
import { user } from '@/db/schema/user';

interface GetMeetingQueryParams {
	conditions: SQL[];
	userId: string;
	limit?: number;
}

export const getMeetingQuery = async ({
	conditions,
	userId,
	limit,
}: GetMeetingQueryParams) => {
	const query = db
		.select({
			...getTableColumns(meetings),
			organization: {
				...getTableColumns(organizations),
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
			permissions: {
				isAdmin: sql<boolean>`
        (
          select ${organizationMembers.role} = 'admin'
          from ${organizationMembers}
          where ${organizationMembers.organizationId} = ${meetings.organizationId}
          and ${organizationMembers.userId} = ${userId}
          limit 1
        )
				or ${meetings.createdBy} = ${userId}
      `,
				canComment: sql<boolean>`
				(
					select ${organizationMembers.role} = 'admin'
					from ${organizationMembers}
					where ${organizationMembers.organizationId} = ${meetings.organizationId}
					and ${organizationMembers.userId} = ${userId}
					limit 1
				)
				or ${meetings.createdBy} = ${userId}
				or exists (
					select 1
					from meeting_members mm
					where mm.meeting_id = ${meetings.id}
					and mm.user_id = ${userId}
				)
			`,
			},
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
				...conditions,
				or(
					sql`
					exists (
						select 1
						from meeting_members mm
						where mm.meeting_id = ${meetings.id}
						and mm.user_id = ${userId}
					)
				`,
					eq(meetings.createdBy, userId),
				),
			),
		)
		.orderBy(meetings.startTime);

	return limit ? query.limit(limit) : query;
};
