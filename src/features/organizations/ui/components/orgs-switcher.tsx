import Link from 'next/link';

import { useSuspenseQuery } from '@tanstack/react-query';
import { ChevronsUpDown, PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useTRPC } from '@/trpc/client';

import { useCreateOrgDialog } from '../../hooks/use-create-org-dialog';
import type { Organization } from '../../types';
import { OrgAvatar } from './org-avatar';

interface OrgsSwitcherProps {
	org: Organization;
}

export const OrgsSwitcher = ({ org }: OrgsSwitcherProps) => {
	const t = useTranslations();
	const trpc = useTRPC();
	const { onOpen } = useCreateOrgDialog();

	const { data } = useSuspenseQuery(trpc.organizations.getMany.queryOptions());

	const filteredData = data.filter(item => item.id !== org.id);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<OrgAvatar name={org.name} imageUrl={org.image} />
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{org.name}</span>
								<span className="truncate text-muted-foreground text-xs">
									Free
								</span>
							</div>
							<ChevronsUpDown className="ml-auto" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						align="start"
						side="bottom"
					>
						<DropdownMenuLabel className="text-muted-foreground text-xs">
							{t('common.organizations')}
						</DropdownMenuLabel>
						{filteredData.map(item => (
							<DropdownMenuItem asChild key={item.id} className="gap-2 p-2">
								<Link href={`/${item.id}`} className="">
									<OrgAvatar name={item.name} imageUrl={item.image} size="sm" />
									{item.name}
								</Link>
							</DropdownMenuItem>
						))}
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => onOpen()} className="gap-2 p-2">
							<PlusIcon className="size-4" />
							{t('orgs.new_org')}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
};
