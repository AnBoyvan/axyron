import { getTranslations } from 'next-intl/server';

import { LocaleSwitcher } from '@/components/shared/locale-switcher';
import { ThemeToggle } from '@/components/shared/theme-toggle';

export const HomeFooter = async () => {
	const t = await getTranslations();

	return (
		<footer className="border-border border-t bg-sidebar">
			<div className="flex flex-col items-center justify-between gap-4 px-4 py-5 md:flex-row md:gap-0 md:px-6 md:py-6 lg:px-[120px]">
				<span className="text-muted-foreground text-xs md:text-[13px]">
					{t('home.footer_copyright')}
				</span>
				<div className="flex items-center gap-4">
					<ThemeToggle />
					<LocaleSwitcher />
				</div>
			</div>
		</footer>
	);
};
