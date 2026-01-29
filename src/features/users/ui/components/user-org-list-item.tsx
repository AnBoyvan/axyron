import Link from 'next/link';

import { ChevronRightIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import type { Organization } from '@/features/organizations/types';
import { OrgAvatar } from '@/features/organizations/ui/components/org-avatar';

import { userOrgNav } from '../../configs/user-org-nav';

interface UserOrgListItem {
	org: Organization;
}

export const UserOrgListItem = ({ org }: UserOrgListItem) => {
	const t = useTranslations();

	return (
		<Collapsible asChild className="group/collapsible">
			<SidebarMenuItem>
				<CollapsibleTrigger asChild>
					<SidebarMenuButton tooltip={org.name}>
						<OrgAvatar size="xs" name={org.name} imageUrl={org.image} />
						<span>{org.name}</span>
						<ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
					</SidebarMenuButton>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<SidebarMenuSub>
						{userOrgNav.map(item => (
							<SidebarMenuSubItem key={item.label}>
								<SidebarMenuSubButton asChild>
									<Link href={`/${org.id}/${item.link}`}>
										<item.icon />
										<span>{t(item.label)}</span>
									</Link>
								</SidebarMenuSubButton>
							</SidebarMenuSubItem>
						))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</SidebarMenuItem>
		</Collapsible>
	);
};
