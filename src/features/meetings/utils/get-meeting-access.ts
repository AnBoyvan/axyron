import { eq, sql } from 'drizzle-orm';

import { db } from '@/db';
import { meetings } from '@/db/schema/meetings';
import { organizationMembers } from '@/db/schema/organization-members';

interface GetMeetingAccessParams {
	meetingId: string;
	userId: string;
}

export async function getMeetingAccess({
	meetingId,
	userId,
}: GetMeetingAccessParams) {
	const [data] = await db
		.select({
			organizationId: meetings.organizationId,
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
		})
		.from(meetings)
		.where(eq(meetings.id, meetingId))
		.limit(1);

	if (!data) {
		return { isAdmin: false, canComment: false, organizationId: undefined };
	}

	return {
		isAdmin: data.isAdmin ?? false,
		canComment: data.canComment ?? false,
		organizationId: data.organizationId,
	};
}
