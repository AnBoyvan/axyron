'use client';

import Link from 'next/link';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { UserButton } from '@/features/users/ui/components/user-button';
import { useTRPC } from '@/trpc/client';

import { OrgNav } from '../../configs/org-nav';
import { OrgsSwitcher } from './orgs-switcher';

interface OrgSidebarProps {
	orgId: string;
}

export const OrgSidebar = ({ orgId }: OrgSidebarProps) => {
	const t = useTranslations();
	const trpc = useTRPC();

	const { data } = useSuspenseQuery(
		trpc.organizations.getById.queryOptions({ id: orgId }),
	);

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<OrgsSwitcher org={data} />
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					{OrgNav.map(item => (
						<SidebarMenuItem key={item.label}>
							<SidebarMenuButton asChild tooltip={t(item.label)}>
								<Link href={`/${orgId}/${item.link}`}>
									<item.icon />
									<span>{t(item.label)}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarGroup>
			</SidebarContent>
			<SidebarSeparator />
			<SidebarFooter>
				<UserButton />
			</SidebarFooter>
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
			<SidebarSeparator />
			<SidebarContent>
				<SidebarGroup>
					{OrgNav.map(item => (
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
			<SidebarSeparator />
			<SidebarFooter>
				<UserButton />
			</SidebarFooter>
		</Sidebar>
	);
};
