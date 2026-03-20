'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

import { homeNav } from '../../configs/home-nav';
import { HomeMobileMenu } from './home-mobile-menu';

export const HomeNavbar = () => {
	const t = useTranslations();

	return (
		<nav className="sticky top-0 z-50 flex h-[60px] items-center justify-between border-sidebar-border border-b bg-sidebar px-4 text-sidebar-foreground md:h-[72px] md:px-6 lg:px-[120px]">
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
			<div className="hidden items-center gap-9 lg:flex">
				{homeNav.map(({ href, label }) => (
					<a
						key={href}
						href={href}
						className="text-[15px] text-sidebar-foreground transition-colors hover:text-accent-foreground"
					>
						{t(label)}
					</a>
				))}
			</div>
			<div className="hidden items-center gap-3 md:flex">
				<Button asChild variant="outline">
					<Link href="/sign-in">{t('auth.sign_in')}</Link>
				</Button>
				<Button asChild>
					<Link
						href="/sign-up"
						className="rounded-md bg-primary px-5 py-2 font-semibold text-primary-foreground text-sm transition-colors hover:bg-primary/85"
					>
						{t('auth.sign_up')}
					</Link>
				</Button>
			</div>
			<HomeMobileMenu />
		</nav>
	);
};
