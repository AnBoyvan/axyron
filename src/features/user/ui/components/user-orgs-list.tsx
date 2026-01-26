import { useSuspenseQuery } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useCreateOrgDialog } from '@/features/organizations/hooks/use-create-org-dialog';
import { useTRPC } from '@/trpc/client';

import { UserOrgListItem } from './user-org-list-item';

export const UserOrgsList = () => {
	const t = useTranslations();
	const trpc = useTRPC();
	const { onOpen } = useCreateOrgDialog();

	const { data } = useSuspenseQuery(trpc.organizations.getMany.queryOptions());

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
			{data.map(org => (
				<UserOrgListItem key={org.id} org={org} />
			))}
		</SidebarGroup>
	);
};

export const UserOrgsListSkeleton = () => {
	const t = useTranslations();

	return (
		<SidebarGroup>
			<SidebarGroupLabel className="justify-between">
				{t('common.organizations')}
			</SidebarGroupLabel>
			{Array.from({ length: 3 }).map((_, idx) => (
				<div key={idx} className="flex h-8 items-center px-2">
					<Skeleton className="h-4 w-32" />
				</div>
			))}
		</SidebarGroup>
	);
};
