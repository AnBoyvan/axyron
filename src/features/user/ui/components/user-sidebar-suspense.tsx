'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useTranslations } from 'next-intl';

import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarSeparator,
} from '@/components/ui/sidebar';

import { UserOrgsListSkeleton } from './user-orgs-list';

export const UserSidebarSuspense = () => {
	const t = useTranslations();
	return (
		<Sidebar>
			<SidebarHeader className="text-sidebar-primary">
				<Link href="/" className="flex items-center justify-center gap-2 px-2">
					<Image src="/logo.svg" height={24} width={24} alt="SynthMeet" />
					<p className="font-goldman font-semibold text-3xl">
						{t('general.app_name')}
					</p>
				</Link>
			</SidebarHeader>
			<SidebarSeparator />
			<SidebarContent>
				<UserOrgsListSkeleton />
			</SidebarContent>
		</Sidebar>
	);
};
