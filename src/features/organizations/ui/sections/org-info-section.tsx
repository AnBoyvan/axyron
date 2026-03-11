import { CreditCardIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Card, CardContent } from '@/components/ui/card';

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
