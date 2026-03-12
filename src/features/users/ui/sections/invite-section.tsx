import { CheckIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAcceptInvite } from '@/features/organizations/hooks/use-accept-invite';
import { useOrgByInviteCode } from '@/features/organizations/hooks/use-org-by-invite-code';
import { OrgAvatar } from '@/features/organizations/ui/components/org-avatar';

interface InviteSectionProps {
	inviteCode: string;
}

export const InviteSection = ({ inviteCode }: InviteSectionProps) => {
	const t = useTranslations();

	const {
		data: { organization, invitator },
	} = useOrgByInviteCode(inviteCode);

	const accept = useAcceptInvite();

	const onAccept = () => {
		accept.mutate({
			inviteCode,
		});
	};

	return (
		<Card className="w-full max-w-md">
			<CardContent className="flex flex-col items-center gap-6 pt-6">
				<OrgAvatar
					size="xl"
					imageUrl={organization.image}
					name={organization.name}
				/>
				<div className="flex flex-col items-center gap-2 text-center">
					<h1 className="font-semibold text-2xl">{organization.name}</h1>
					{organization.description && (
						<p className="text-muted-foreground text-sm">
							{organization.description}
						</p>
					)}
				</div>
				<p className="text-center text-muted-foreground text-sm">
					{t.rich('orgs.invite_message', {
						inviter: invitator.name,
						organization: organization.name,
						b: chunks => <strong>{chunks}</strong>,
					})}
				</p>
				<Button
					className="w-full"
					onClick={onAccept}
					disabled={accept.isPending}
				>
					<CheckIcon />
					{t('orgs.invite_accept')}
				</Button>
			</CardContent>
		</Card>
	);
};

export const InviteSectionSkeleton = () => {
	return (
		<Card className="w-full max-w-md">
			<CardContent className="flex flex-col items-center gap-6 pt-6">
				<Skeleton className="size-16 rounded-md" />
				<div className="flex flex-col items-center gap-2">
					<Skeleton className="h-7 w-40" />
					<Skeleton className="h-4 w-56" />
				</div>
				<div className="flex w-full flex-col items-center gap-1">
					<Skeleton className="h-4 w-72" />
					<Skeleton className="h-4 w-48" />
				</div>
				<Skeleton className="h-9 w-full" />
			</CardContent>
		</Card>
	);
};
