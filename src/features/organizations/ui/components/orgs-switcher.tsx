import Link from 'next/link';

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
	useSidebar,
} from '@/components/ui/sidebar';

import { useCreateOrgDialog } from '../../hooks/use-create-org-dialog';
import { useOrganizations } from '../../hooks/use-organizations';
import type { Organization } from '../../types';
import { OrgAvatar } from './org-avatar';

interface OrgsSwitcherProps {
	org: Organization;
}

export const OrgsSwitcher = ({ org }: OrgsSwitcherProps) => {
	const t = useTranslations();
	const { onOpen } = useCreateOrgDialog();
	const { state } = useSidebar();

	const { data } = useOrganizations();

	const filteredData = data.filter(item => item.id !== org.id);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton size="lg" className="h-[52px] py-1.5">
							{state === 'collapsed' ? (
								<div className="flex size-8 items-center justify-center">
									<OrgAvatar name={org.name} imageUrl={org.image} size="sm" />
								</div>
							) : (
								<>
									<OrgAvatar name={org.name} imageUrl={org.image} />
									<div className="grid flex-1 text-left text-sidebar-foreground text-sm leading-tight">
										<span className="truncate font-medium">{org.name}</span>
										<span className="truncate text-muted-foreground text-xs">
											Free
										</span>
									</div>
									<ChevronsUpDown className="ml-auto" />
								</>
							)}
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
								<Link href={`/org/${item.id}`} className="">
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
