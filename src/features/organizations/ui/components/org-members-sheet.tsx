import { UsersIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { UserAvatar } from '@/features/users/ui/components/user-avatar';

import type { OrgMember } from '../../types';

interface OrgMembersSheetProps {
	members: OrgMember[];
}

export const OrgMembersSheet = ({ members }: OrgMembersSheetProps) => {
	const t = useTranslations();

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline">
					<UsersIcon />
					{t('common.members')}
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader className="flex flex-row items-center justify-center gap-2 border-b">
					<UsersIcon className="size-4" />
					<SheetTitle>{t('orgs.members')}</SheetTitle>
				</SheetHeader>
				<div className="max-h-full overflow-y-scroll px-4">
					{members.map(member => (
						<div key={member.userId} className="flex items-center gap-2 p-1">
							<UserAvatar
								size="lg"
								imageUrl={member.image}
								name={member.name}
								isAdmin={member.role === 'admin'}
							/>
							<div className="flex flex-col truncate">
								<p className="truncate">{member.name}</p>
								<p className="truncate text-muted-foreground text-sm">
									{member.email}
								</p>
							</div>
						</div>
					))}
				</div>
			</SheetContent>
		</Sheet>
	);
};
