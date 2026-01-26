import { PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar';
import { useCreateOrgDialog } from '@/features/organizations/hooks/use-create-org';

export const UserOrgsList = () => {
	const t = useTranslations();
	const { onOpen } = useCreateOrgDialog();

	return (
		<SidebarGroup>
			<SidebarGroupLabel className="justify-between">
				{t('common.organizations')}
				<Button
					size="xs"
					variant="ghost"
					onClick={() => onOpen()}
					className="text-primary"
				>
					<PlusIcon />
					{t('common.new')}
				</Button>
			</SidebarGroupLabel>
		</SidebarGroup>
	);
};
