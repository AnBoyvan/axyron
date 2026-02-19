import { BellIcon } from 'lucide-react';
import { type TranslationKey, useTranslations } from 'next-intl';

import { Separator } from '../ui/separator';
import { SidebarTrigger } from '../ui/sidebar';
import { ThemeToggle } from './theme-toggle';

interface PageLayoutProps {
	title: TranslationKey;
	children: React.ReactNode;
}

export const PageLayout = ({ title, children }: PageLayoutProps) => {
	const t = useTranslations();
	return (
		<>
			<header className="sticky top-0 flex h-14 shrink-0 items-center gap-4 bg-sidebar px-4 text-sidebar-foreground">
				<SidebarTrigger className="size-8" />
				<Separator orientation="vertical" className="h-7!" />
				<span className="flex-1 truncate font-medium text-lg">{t(title)}</span>
				<div className="flex items-center gap-2">
					<div className="flex size-8 shrink-0 items-center justify-center">
						<BellIcon className="size-4 shrink-0" />
					</div>
					<ThemeToggle />
				</div>
			</header>
			<Separator />
			<div className="flex flex-1 flex-col p-4 lg:p-8">{children}</div>
		</>
	);
};
