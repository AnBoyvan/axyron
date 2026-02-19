import type { OrgMemberSelectSchema } from '@/db/schema/organization-members';
import type { OrgSelectSchema } from '@/db/schema/organizations';

interface GetOrgPermissionsProps {
	org: OrgSelectSchema;
	member: OrgMemberSelectSchema;
}

export const getOrgPermissions = ({ org, member }: GetOrgPermissionsProps) => {
	const isAdmin = member.role === 'admin';

	return {
		isAdmin,
		update: isAdmin || member.canUpdate,
		removeMember: isAdmin || member.canRemoveMember,
		invite: isAdmin || org.canInvite || member.canInvite,
		createProject: isAdmin || org.canCreateProject || member.canCreateProject,
		createMeeting: isAdmin || org.canCreateMeeting || member.canCreateMeeting,
	};
};
