import Image from 'next/image';
import Link from 'next/link';

import { MenuIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { LocaleSwitcher } from '@/components/shared/locale-switcher';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Button } from '@/components/ui/button';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer';

import { homeNav } from '../../configs/home-nav';

export const HomeMobileMenu = () => {
	const t = useTranslations();

	return (
		<Drawer direction="top">
			<DrawerTrigger asChild>
				<Button size="icon" variant="ghost" className="md:hidden">
					<MenuIcon size={24} />
				</Button>
			</DrawerTrigger>
			<DrawerContent
				aria-describedby={undefined}
				className="flex flex-col bg-sidebar p-6"
			>
				<DrawerHeader className="p-0">
					<DrawerTitle asChild>
						<DrawerClose asChild>
							<Link href="/" className="flex items-center gap-2">
								<Image
									src="/logo.svg"
									height={24}
									width={24}
									alt={t('general.app_name')}
								/>
								<p className="font-goldman font-semibold text-3xl text-primary">
									{t('general.app_name')}
								</p>
							</Link>
						</DrawerClose>
					</DrawerTitle>
				</DrawerHeader>
				<nav className="mt-8 flex flex-col gap-1">
					{homeNav.map(({ href, label }) => (
						<DrawerClose key={href} asChild>
							<a
								href={href}
								className="rounded-md px-3 py-2.5 text-base text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-accent-foreground"
							>
								{t(label)}
							</a>
						</DrawerClose>
					))}
				</nav>
				<div className="mt-auto flex flex-col gap-3 border-sidebar-border border-t pt-6">
					<DrawerClose asChild>
						<Button asChild variant="outline">
							<Link href="/sign-in">{t('auth.sign_in')}</Link>
						</Button>
					</DrawerClose>
					<DrawerClose asChild>
						<Button asChild>
							<Link href="/sign-up">{t('auth.sign_up')}</Link>
						</Button>
					</DrawerClose>
					<div className="flex items-center justify-between gap-4">
						<ThemeToggle />
						<LocaleSwitcher />
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
};
