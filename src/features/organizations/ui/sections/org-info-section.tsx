import { CreditCardIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { useOrgById } from '../../hooks/use-org-by-id';
import { useOrgMembers } from '../../hooks/use-org-members';
import { InvitePopover } from '../components/invite-popover';
import { OrgAvatar } from '../components/org-avatar';
import { OrgMembersSheet } from '../components/org-members-sheet';

interface OrgInfoSectionProps {
	orgId: string;
}

export const OrgInfoSection = ({ orgId }: OrgInfoSectionProps) => {
	const t = useTranslations();

	const { data: org } = useOrgById(orgId);
	const { data: members } = useOrgMembers(orgId);

	return (
		<Card>
			<CardContent>
				<div className="flex flex-col gap-4">
					<div className="flex gap-4">
						<OrgAvatar size="xl" imageUrl={org.image} name={org.name} />
						<div className="flex w-full justify-between gap-4">
							<div className="flex flex-col">
								<h1 className="text-xl">{org.name}</h1>
								{/* TODO: tier*/}
								<div className="flex items-center gap-2">
									<CreditCardIcon className="size-3" />
									<p className="text-center text-sm">Free</p>
								</div>
							</div>
							<div className="hidden gap-2 lg:flex">
								<OrgMembersSheet members={members} />
								{org.permissions.invite && (
									<InvitePopover
										inviteCode={org.member.inviteCode}
										orgId={org.id}
									/>
								)}
							</div>
						</div>
					</div>
					<p className="text-muted-foreground text-sm">{org.description}</p>
					<div className="ml-auto flex gap-2 lg:hidden">
						<OrgMembersSheet members={members} />
						{org.permissions.invite && (
							<InvitePopover
								inviteCode={org.member.inviteCode}
								orgId={org.id}
							/>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export const OrgInfoSectionSkeleton = () => {
	return (
		<Card>
			<CardContent>
				<div className="flex flex-col gap-4">
					<div className="flex gap-4">
						<Skeleton className="size-12 shrink-0 rounded-md" />
						<div className="flex w-full justify-between gap-4">
							<div className="flex flex-col gap-2 py-0.5">
								<Skeleton className="h-5 w-40" />
								<Skeleton className="h-3.5 w-20" />
							</div>
							<div className="hidden gap-2 lg:flex">
								<Skeleton className="h-9 w-24" />
							</div>
						</div>
					</div>
					<div className="flex flex-col gap-2 py-1">
						<Skeleton className="h-3 w-full" />
						<Skeleton className="h-3 w-3/4" />
					</div>
					<div className="ml-auto flex gap-2 lg:hidden">
						<Skeleton className="h-9 w-24" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
