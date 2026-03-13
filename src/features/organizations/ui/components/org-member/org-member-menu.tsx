import type { ReactNode } from 'react';

import {
	CalendarPlusIcon,
	ChevronsUpIcon,
	ClipboardPlusIcon,
	TriangleAlertIcon,
	UserPlusIcon,
	UserXIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLeaveOrg } from '@/features/organizations/hooks/use-leave-org';
import { useRemoveOrgMember } from '@/features/organizations/hooks/use-remove-org-member';
import { useUpdateOrgMember } from '@/features/organizations/hooks/use-update-org-member';
import type { OrgMember } from '@/features/organizations/types';
import { useConfirm } from '@/hooks/use-confirm';
import { authClient } from '@/lib/auth/auth-client';

type Permission = 'canInvite' | 'canCreateProject' | 'canCreateMeeting';

interface OrgMemberMenuProps {
	member: OrgMember;
	children: ReactNode;
}

export const OrgMemberMenu = ({ member, children }: OrgMemberMenuProps) => {
	const t = useTranslations();
	const { data } = authClient.useSession();

	const [RemoveConfirmDialog, confirmRemove] = useConfirm({
		title: t('common.sure'),
		message: t('orgs.remove_member_alert'),
		action: t('actions.remove'),
		variant: 'destructive',
		media: <TriangleAlertIcon className="size-10 text-destructive" />,
	});

	const isOwn = member.userId === data?.user.id;
	const isAdmin = member.role === 'admin';
	const canInvite = isAdmin || member.canInvite;
	const canCreateProject = isAdmin || member.canCreateProject;
	const canCreateMeeting = isAdmin || member.canCreateMeeting;

	const updateMember = useUpdateOrgMember();
	const removeMember = useRemoveOrgMember();
	const leave = useLeaveOrg();

	const updateRole = (role: 'admin' | 'member') => {
		updateMember.mutate({
			organizationId: member.organizationId,
			userId: member.userId,
			data: { role },
		});
	};

	const updatePermission = ({
		permission,
		value,
	}: {
		permission: Permission;
		value: boolean;
	}) => {
		updateMember.mutate({
			organizationId: member.organizationId,
			userId: member.userId,
			data: { [permission]: value },
		});
	};

	const removeOrLeave = async () => {
		const ok = await confirmRemove();
		if (!ok) return;

		if (isOwn) {
			leave.mutate({
				organizationId: member.organizationId,
			});
		} else {
			removeMember.mutate({
				organizationId: member.organizationId,
				userId: member.userId,
			});
		}
	};

	return (
		<>
			<RemoveConfirmDialog />
			<DropdownMenu>
				<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					{!isOwn && (
						<>
							<DropdownMenuItem
								onClick={() => updateRole(isAdmin ? 'member' : 'admin')}
							>
								<ChevronsUpIcon
									className={
										isAdmin
											? 'text-muted-foreground opacity-50'
											: 'text-primary'
									}
								/>
								{t(isAdmin ? 'members.admin_revoke' : 'members.admin_add')}
							</DropdownMenuItem>
							{!isAdmin && (
								<>
									<DropdownMenuItem
										onClick={() =>
											updatePermission({
												permission: 'canInvite',
												value: !canInvite,
											})
										}
									>
										<UserPlusIcon
											className={
												canInvite
													? 'text-muted-foreground opacity-50'
													: 'text-primary'
											}
										/>
										{t(
											canInvite
												? 'members.add_members_deny'
												: 'members.add_members_allow',
										)}
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() =>
											updatePermission({
												permission: 'canCreateProject',
												value: !canCreateProject,
											})
										}
									>
										<ClipboardPlusIcon
											className={
												canCreateProject
													? 'text-muted-foreground opacity-50'
													: 'text-primary'
											}
										/>
										{t(
											canCreateProject
												? 'members.add_projects_deny'
												: 'members.add_projects_allow',
										)}
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() =>
											updatePermission({
												permission: 'canCreateMeeting',
												value: !canCreateMeeting,
											})
										}
									>
										<CalendarPlusIcon
											className={
												canCreateMeeting
													? 'text-muted-foreground opacity-50'
													: 'text-primary'
											}
										/>
										{t(
											canCreateMeeting
												? 'members.add_meetings_deny'
												: 'members.add_meetings_allow',
										)}
									</DropdownMenuItem>
								</>
							)}
						</>
					)}
					<DropdownMenuItem
						variant="destructive"
						onClick={() => removeOrLeave()}
					>
						<UserXIcon />
						{t(
							member.userId === data?.user.id
								? 'actions.leave'
								: 'members.remove',
						)}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};
