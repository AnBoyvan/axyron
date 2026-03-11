'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useTranslations } from 'next-intl';

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';

import { orgAdminsNav, orgMembersNav } from '../../configs/org-nav';
import { useOrgById } from '../../hooks/use-org-by-id';
import { OrgsSwitcher } from './orgs-switcher';

interface OrgSidebarProps {
	orgId: string;
}

export const OrgSidebar = ({ orgId }: OrgSidebarProps) => {
	const t = useTranslations();
	const pathname = usePathname();

	const { data } = useOrgById(orgId);

	const segments = pathname.split('/').filter(Boolean);
	const activeSection = segments[2] ?? null;

	const isActive = (link: string) => {
		if (!link) return segments.length === 1;
		return activeSection === link;
	};

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader className="py-0.5">
				<OrgsSwitcher org={data} />
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					{orgMembersNav.map(item => (
						<SidebarMenuItem key={item.label}>
							<SidebarMenuButton
								asChild
								tooltip={t(item.label)}
								isActive={isActive(item.link)}
							>
								<Link href={`/org/${orgId}/${item.link}`}>
									<item.icon />
									<span>{t(item.label)}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarGroup>
				{data.permissions.isAdmin && (
					<SidebarGroup>
						<SidebarGroupLabel>{t('common.administration')}</SidebarGroupLabel>
						{orgAdminsNav.map(item => (
							<SidebarMenuItem key={item.label}>
								<SidebarMenuButton
									asChild
									tooltip={t(item.label)}
									isActive={isActive(item.link)}
								>
									<Link href={`/org/${orgId}/${item.link}`}>
										<item.icon />
										<span>{t(item.label)}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarGroup>
				)}
			</SidebarContent>
		</Sidebar>
	);
};

export const OrgSidebarSkeleton = ({ orgId }: OrgSidebarProps) => {
	const t = useTranslations();
	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" className="p-1.5">
							<Skeleton className="size-8 min-w-8 rounded-xl" />
							<div className="flex h-full flex-col gap-1 py-1">
								<Skeleton className="h-3 w-28" />
								<Skeleton className="h-2.5 w-10" />
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					{orgMembersNav.map(item => (
						<SidebarMenuItem key={item.label}>
							<SidebarMenuButton asChild>
								<Link href={`/${orgId}/${item.link}`}>
									<item.icon />
									<span>{t(item.label)}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
};
