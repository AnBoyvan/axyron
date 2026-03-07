import type { ReactNode } from 'react';

import {
	ChevronsUpIcon,
	FilePlusCornerIcon,
	UserPlusIcon,
	UserXIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRemoveProjectMember } from '@/features/projects/hooks/use-remove-project-member';
import { useUpdateProjectMember } from '@/features/projects/hooks/use-update-project-member';
import type { ProjectById } from '@/features/projects/types';
import { authClient } from '@/lib/auth/auth-client';

interface ProjectMemberMenuProps {
	member: ProjectById['members'][number];
	children: ReactNode;
}

export const ProjectMemberMenu = ({
	member,
	children,
}: ProjectMemberMenuProps) => {
	const t = useTranslations();
	const { data } = authClient.useSession();

	const updateMember = useUpdateProjectMember();
	const removeMember = useRemoveProjectMember();

	const updateRole = (role: 'admin' | 'member') => {
		updateMember.mutate({
			projectId: member.projectId,
			userId: member.userId,
			role,
		});
	};

	const updateInviteAccess = (canInvite: boolean) => {
		updateMember.mutate({
			projectId: member.projectId,
			userId: member.userId,
			canInvite,
		});
	};

	const updateTasksAccess = (canCreateTasks: boolean) => {
		updateMember.mutate({
			projectId: member.projectId,
			userId: member.userId,
			canCreateTasks,
		});
	};

	const removeOrLeave = () => {
		removeMember.mutate({
			projectId: member.projectId,
			userId: member.userId,
		});
	};

	const isAdmin = member.role === 'admin';
	const canCreateTask = isAdmin || member.canCreateTask;
	const canInvite = isAdmin || member.canInvite;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{member.userId !== data?.user.id && (
					<>
						<DropdownMenuItem
							onClick={() => updateRole(isAdmin ? 'member' : 'admin')}
						>
							<ChevronsUpIcon
								className={
									isAdmin ? 'text-muted-foreground opacity-50' : 'text-primary'
								}
							/>
							{t(isAdmin ? 'members.admin_revoke' : 'members.admin_add')}
						</DropdownMenuItem>
						{!isAdmin && (
							<>
								<DropdownMenuItem
									onClick={() => updateInviteAccess(!canInvite)}
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
									onClick={() => updateTasksAccess(!canCreateTask)}
								>
									<FilePlusCornerIcon
										className={
											canCreateTask
												? 'text-muted-foreground opacity-50'
												: 'text-primary'
										}
									/>
									{t(
										canCreateTask
											? 'tasks.manage_tasks_deny'
											: 'tasks.manage_tasks_allow',
									)}
								</DropdownMenuItem>
							</>
						)}
						<DropdownMenuSeparator />
					</>
				)}
				<DropdownMenuItem variant="destructive" onClick={() => removeOrLeave()}>
					<UserXIcon />
					{t(
						member.userId === data?.user.id
							? 'actions.leave'
							: 'members.remove',
					)}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
