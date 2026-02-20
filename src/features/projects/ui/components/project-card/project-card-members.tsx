import { useTranslations } from 'next-intl';

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import type { ProjectMemberDTO } from '@/features/projects/types';
import { UserAvatar } from '@/features/users/ui/components/user-avatar';

interface ProjectCardMemberProps {
	member: ProjectMemberDTO;
}

export const ProjectCardMember = ({ member }: ProjectCardMemberProps) => {
	const t = useTranslations();

	const isAdmin = member.role === 'admin';

	return (
		<Tooltip>
			<TooltipTrigger>
				<UserAvatar
					imageUrl={member.image}
					name={member.name}
					isAdmin={isAdmin}
				/>
			</TooltipTrigger>
			<TooltipContent>
				<p>
					{member.name}
					<span className="text-primary">
						{isAdmin && t('members.admin_tooltip')}
					</span>
				</p>
			</TooltipContent>
		</Tooltip>
	);
};
