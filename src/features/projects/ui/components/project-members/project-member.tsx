import {
	ChevronsUpIcon,
	EllipsisIcon,
	FilePlusCornerIcon,
	UserPlusIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import type { ProjectById } from '@/features/projects/types';
import { UserAvatar } from '@/features/users/ui/components/user-avatar';
import { authClient } from '@/lib/auth/auth-client';
import { cn } from '@/lib/utils/cn';

import { ProjectMemberMenu } from './project-member-menu';

interface ProjectMemberProps {
	orgId: string;
	member: ProjectById['members'][number];
	canUpdate?: boolean;
}

export const ProjectMember = ({ member, canUpdate }: ProjectMemberProps) => {
	const t = useTranslations();
	const { data } = authClient.useSession();

	const isAdmin = member.role === 'admin';
	const canCreateTask = isAdmin || member.canCreateTask;
	const canInvite = isAdmin || member.canInvite;
	const isOwn = member.userId === data?.user.id;

	return (
		<div className="flex items-center gap-2 rounded-md bg-muted p-2 transition-colors hover:bg-accent/20">
			<UserAvatar
				imageUrl={member.image}
				name={member.name}
				size="xl"
				form="square"
			/>
			<div className="flex flex-col gap-1">
				<p className="truncate">{member.name}</p>
				<div className="flex items-center gap-2">
					<Tooltip>
						<TooltipTrigger>
							<ChevronsUpIcon
								className={cn(
									'size-5',
									isAdmin ? 'text-primary' : 'text-muted-foreground opacity-50',
								)}
							/>
						</TooltipTrigger>
						<TooltipContent>
							<p>{t(isAdmin ? 'members.admin' : 'common.member')}</p>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger>
							<UserPlusIcon
								className={cn(
									'size-4',
									canInvite
										? 'text-primary'
										: 'text-muted-foreground opacity-50',
								)}
							/>
						</TooltipTrigger>
						<TooltipContent>
							<p>
								{t(
									canInvite
										? 'members.add_members_allowed'
										: 'members.add_members_denied',
								)}
							</p>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger>
							<FilePlusCornerIcon
								className={cn(
									'size-4',
									canCreateTask
										? 'text-primary'
										: 'text-muted-foreground opacity-50',
								)}
							/>
						</TooltipTrigger>
						<TooltipContent>
							<p>
								{t(
									canCreateTask
										? 'tasks.manage_tasks_allowed'
										: 'tasks.manage_tasks_denied',
								)}
							</p>
						</TooltipContent>
					</Tooltip>
				</div>
			</div>
			{(canUpdate || isOwn) && (
				<div className="ml-auto">
					<ProjectMemberMenu member={member}>
						<Button variant="ghost" size="icon">
							<EllipsisIcon />
						</Button>
					</ProjectMemberMenu>
				</div>
			)}
		</div>
	);
};

export const ProjectMemberSkeleton = () => {
	return (
		<div className="flex items-center gap-2 rounded-md bg-muted p-2 transition-colors hover:bg-accent/20">
			<Skeleton className="rouded-md size-12" />
			<div className="flex flex-col gap-1">
				<Skeleton className="h-4 w-40" />
				<div className="flex items-center gap-2">
					<ChevronsUpIcon className="size-5 text-muted-foreground opacity-20" />
					<UserPlusIcon className="size-5 text-muted-foreground opacity-20" />
					<FilePlusCornerIcon className="size-5 text-muted-foreground opacity-20" />
				</div>
			</div>
		</div>
	);
};
