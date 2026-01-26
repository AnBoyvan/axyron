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
		invite: isAdmin || org.canInvite || member.canInvite,
		removeMember: isAdmin || member.canRemoveMember,
		createProject: isAdmin || org.canCreateProject || member.canCreateProject,
		createTask: isAdmin || org.canCreateTask || member.canCreateTask,
		createMeeting: isAdmin || org.canCreateMeeting || member.canCreateMeeting,
	};
};
