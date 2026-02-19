import { and, eq, sql } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import { meetingMembers } from '@/db/schema/meeting-members';
import { meetings } from '@/db/schema/meetings';
import { organizations } from '@/db/schema/organizations';
import { user } from '@/db/schema/user';
import { protectedProcedure } from '@/trpc/init';

export const getByOrganization = protectedProcedure
	.input(z.object({ organizationId: z.string() }))
	.query(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const membersCte = db.$with('members_cte').as(
			db
				.select({
					meetingId: meetingMembers.meetingId,
					members: sql<
						{
							userId: string;
							name: string;
							email: string;
							image: string | null;
							status: 'pending' | 'accepted' | 'rejected';
						}[]
					>`
            json_agg(
              jsonb_build_object(
                'userId', u.id,
                'name', u.name,
                'email', u.email,
                'image', u.image,
                'status', mm.status
              )
              order by mm.created_at
            )
          `,
				})
				.from(meetingMembers)
				.innerJoin(user, eq(user.id, meetingMembers.userId))
				.groupBy(meetingMembers.meetingId),
		);

		const commentsCte = db.$with('comments_cte').as(
			db
				.select({
					meetingId: sql<string>`mc.meeting_id`,
					count: sql<number>`count(*)::int`,
				})
				.from(sql`meeting_comments mc`)
				.groupBy(sql`mc.meeting_id`),
		);

		const data = await db
			.with(membersCte, commentsCte)
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
				>`coalesce(${membersCte.members}, '[]'::json)`,
				commentsCount: sql<number>`coalesce(${commentsCte.count}, 0)`,
			})
			.from(meetings)
			.innerJoin(
				meetingMembers,
				and(
					eq(meetingMembers.meetingId, meetings.id),
					eq(meetingMembers.userId, userId),
				),
			)
			.innerJoin(organizations, eq(organizations.id, meetings.organizationId))
			.innerJoin(user, eq(user.id, meetings.createdBy))
			.leftJoin(membersCte, eq(membersCte.meetingId, meetings.id))
			.leftJoin(commentsCte, eq(commentsCte.meetingId, meetings.id))
			.where(eq(meetings.organizationId, input.organizationId))
			.orderBy(meetings.startTime);

		return data.map(item => ({
			...item.meeting,
			organization: item.organization,
			creator: item.creator,
			members: item.members,
			commentsCount: item.commentsCount,
		}));
	});
