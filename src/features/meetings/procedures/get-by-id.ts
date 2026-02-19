import { TRPCError } from '@trpc/server';
import { and, eq, sql } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import { meetingMembers } from '@/db/schema/meeting-members';
import { meetings } from '@/db/schema/meetings';
import { organizations } from '@/db/schema/organizations';
import { user } from '@/db/schema/user';
import { protectedProcedure } from '@/trpc/init';

export const getById = protectedProcedure
	.input(z.object({ meetingId: z.string(), organizationId: z.string() }))
	.query(async ({ ctx, input }) => {
		const userId = ctx.auth.user.id;

		const [userAsMember] = await db
			.select({
				meetingIds: meetingMembers.meetingId,
			})
			.from(meetingMembers)
			.where(
				and(
					eq(meetingMembers.userId, userId),
					eq(meetingMembers.organizationId, input.organizationId),
					eq(meetingMembers.meetingId, input.meetingId),
				),
			)
			.limit(1);

		if (!userAsMember) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'meetings.not_member',
			});
		}

		const [data] = await db
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
          coalesce(
            (
              select json_agg(
                jsonb_build_object(
                  'userId', u.id,
                  'name', u.name,
                  'email', u.email,
                  'image', u.image,
                  'status', mm.status
                )
                order by mm.created_at
              )
              from meeting_members mm
              join "user" u on u.id = mm.user_id
              where mm.meeting_id = ${meetings.id}
            ),
            '[]'::json
          )
        `,
				comments: sql<
					{
						id: string;
						content: string;
						edited: boolean;
						createdAt: Date;
						updatedAt: Date;
						author: {
							id: string;
							name: string;
							email: string;
							image: string | null;
						};
					}[]
				>`
          coalesce(
            (
              select json_agg(
                jsonb_build_object(
                  'id', mc.id,
                  'content', mc.content,
                  'edited', mc.edited,
                  'createdAt', mc.created_at,
                  'updatedAt', mc.updated_at,
                  'author', jsonb_build_object(
                    'id', u.id,
                    'name', u.name,
                    'email', u.email,
                    'image', u.image
                  )
                )
                order by mc.created_at desc
              )
              from meeting_comments mc
              join "user" u on u.id = mc.user_id
              where mc.meeting_id = ${meetings.id}
            ),
            '[]'::json
          )
        `,
			})
			.from(meetings)
			.innerJoin(organizations, eq(organizations.id, meetings.organizationId))
			.innerJoin(user, eq(user.id, meetings.createdBy))
			.where(eq(meetings.id, input.meetingId))
			.limit(1);

		if (!data) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'meetings.not_found',
			});
		}

		return {
			...data.meeting,
			organization: data.organization,
			creator: data.creator,
			members: data.members,
			comments: data.comments,
		};
	});
