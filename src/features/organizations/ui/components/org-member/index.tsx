import { EllipsisVerticalIcon, MailIcon, SmartphoneIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { OrgMember as OrgMemberType } from '@/features/organizations/types';
import { UserAvatar } from '@/features/users/ui/components/user-avatar';

import { OrgMemberBadges } from './org-member-badges';
import { OrgMemberMenu } from './org-member-menu';

interface OrgMemberProps {
	member: OrgMemberType;
}

export const OrgMember = ({ member }: OrgMemberProps) => {
	return (
		<Card className="py-4">
			<CardContent className="flex flex-col gap-2 px-4">
				<div className="flex flex-1 gap-2 overflow-hidden">
					<UserAvatar
						size="2xl"
						form="square"
						imageUrl={member.image}
						name={member.name}
					/>
					<div className="ml-2 flex min-w-0 flex-1 flex-col justify-around">
						<div className="flex h-6 items-center gap-2">
							<p className="truncate font-semibold">{member.name}</p>
						</div>
						<div className="flex h-6 items-center gap-2">
							<MailIcon className="size-4 shrink-0 text-muted-foreground" />
							<p className="truncate text-sm">{member.email}</p>
						</div>
						<div className="flex h-6 items-center gap-2">
							<SmartphoneIcon className="size-4 shrink-0 text-muted-foreground" />
							<p className="truncate text-sm">{member.phone}</p>
						</div>
					</div>
					<OrgMemberMenu member={member}>
						<Button variant="ghost" className="ml-auto">
							<EllipsisVerticalIcon />
						</Button>
					</OrgMemberMenu>
				</div>
				<OrgMemberBadges member={member} />
			</CardContent>
		</Card>
	);
};

export const OrgMemberSkeleton = () => {
	return (
		<Card className="py-4">
			<CardContent className="flex flex-col gap-2 px-4">
				<div className="flex flex-1 gap-2 overflow-hidden">
					<Skeleton className="size-20 shrink-0 rounded-md" />
					<div className="ml-2 flex min-w-0 flex-1 flex-col justify-around">
						<Skeleton className="h-4 w-32" />
						<Skeleton className="h-4 w-48" />
						<Skeleton className="h-4 w-28" />
					</div>
				</div>
				<div className="flex h-5 items-center gap-4">
					{Array.from({ length: 4 }).map((_, idx) => (
						<Skeleton key={idx} className="size-5 shrink-0 rounded-md" />
					))}
				</div>
			</CardContent>
		</Card>
	);
};
