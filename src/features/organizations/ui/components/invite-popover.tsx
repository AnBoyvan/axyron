import {
	CopyIcon,
	RefreshCwIcon,
	TriangleAlertIcon,
	UserPlusIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useConfirm } from '@/hooks/use-confirm';

import { useResetInviteCode } from '../../hooks/use-reset-invite-code';

interface InvitePopoverProps {
	inviteCode: string;
	orgId: string;
}

export const InvitePopover = ({ inviteCode, orgId }: InvitePopoverProps) => {
	const t = useTranslations();

	const [ResetConfirmDialog, confirmReset] = useConfirm({
		title: t('common.sure'),
		message: t('orgs.reset_code_warning'),
		action: t('actions.reset'),
		media: (
			<TriangleAlertIcon className="size-10 text-amber-600 dark:text-amber-500" />
		),
	});

	const resetCode = useResetInviteCode();

	const onCodeReset = async () => {
		const ok = await confirmReset();
		if (!ok) return;

		resetCode.mutate({
			organizationId: orgId,
		});
	};

	const base = process.env.NEXT_PUBLIC_APP_URL;
	const link = `${base}/user/invite/${inviteCode}`;

	const onCopyLink = async () => {
		await navigator.clipboard.writeText(link);

		toast.success(t('common.link_copied'));
	};

	return (
		<>
			<ResetConfirmDialog />
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button>
						<UserPlusIcon />
						{t('actions.invite')}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={onCopyLink}>
						<CopyIcon />
						{t('actions.copy_invite')}
					</DropdownMenuItem>
					<DropdownMenuItem onClick={onCodeReset}>
						<RefreshCwIcon />
						{t('orgs.reset_code')}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};
