import { BellIcon } from 'lucide-react';

import { LocaleSwitcher } from '@/components/shared/locale-switcher';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

import { UserButton } from './user-button';

export const UserNavbar = () => {
	return (
		<header className="sticky top-0 z-50 flex h-14 w-full shrink-0 items-center gap-4 border-b bg-sidebar px-4 text-sidebar-foreground">
			<SidebarTrigger className="size-8" />
			<Separator orientation="vertical" className="h-7!" />
			<div className="flex-1" />
			<div className="flex items-center gap-2">
				<div className="flex size-8 shrink-0 items-center justify-center">
					<BellIcon className="size-4 shrink-0" />
				</div>
				<ThemeToggle />
				<LocaleSwitcher />
				<UserButton />
			</div>
		</header>
	);
};
