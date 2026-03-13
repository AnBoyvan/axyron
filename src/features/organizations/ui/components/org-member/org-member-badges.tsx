import {
	CalendarPlusIcon,
	ChevronsUpIcon,
	ClipboardPlusIcon,
	UserPlusIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import type { OrgMember } from '@/features/organizations/types';
import { cn } from '@/lib/utils/cn';

interface OrgMemberBadgesProps {
	member: OrgMember;
}

export const OrgMemberBadges = ({ member }: OrgMemberBadgesProps) => {
	const t = useTranslations();

	const isAdmin = member.role === 'admin';
	const canInvite = isAdmin || member.canInvite;
	const canCreateProject = isAdmin || member.canCreateProject;
	const canCreateMeeting = isAdmin || member.canCreateMeeting;

	return (
		<div className="flex items-center gap-4">
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
							canInvite ? 'text-primary' : 'text-muted-foreground opacity-50',
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
					<ClipboardPlusIcon
						className={cn(
							'size-4',
							canCreateProject
								? 'text-primary'
								: 'text-muted-foreground opacity-50',
						)}
					/>
				</TooltipTrigger>
				<TooltipContent>
					<p>
						{t(
							canCreateProject
								? 'members.add_projects_allowed'
								: 'members.add_projects_denied',
						)}
					</p>
				</TooltipContent>
			</Tooltip>
			<Tooltip>
				<TooltipTrigger>
					<CalendarPlusIcon
						className={cn(
							'size-4',
							canCreateMeeting
								? 'text-primary'
								: 'text-muted-foreground opacity-50',
						)}
					/>
				</TooltipTrigger>
				<TooltipContent>
					<p>
						{t(
							canCreateMeeting
								? 'members.add_meetings_allowed'
								: 'members.add_meetings_denied',
						)}
					</p>
				</TooltipContent>
			</Tooltip>
		</div>
	);
};
