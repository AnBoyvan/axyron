import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useTranslations } from 'next-intl';

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';

import { userNav } from '../../configs/user-nav';

export const UserNav = () => {
	const t = useTranslations();
	const pathname = usePathname();

	return (
		<SidebarGroup>
			<SidebarGroupLabel className="justify-between">
				{t('users.personal')}
			</SidebarGroupLabel>
			{userNav.map(item => (
				<SidebarMenuItem key={item.label}>
					<SidebarMenuButton
						asChild
						tooltip={item.label}
						isActive={`/user${item.link}` === pathname}
					>
						<Link href={`/user${item.link}`}>
							<item.icon />
							<span>{t(item.label)}</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			))}
		</SidebarGroup>
	);
};
