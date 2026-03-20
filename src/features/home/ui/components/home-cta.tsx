import Link from 'next/link';

import { useTranslations } from 'next-intl';

export const HomeCta = () => {
	const t = useTranslations();

	return (
		<section className="flex justify-center bg-card px-4 py-[60px] md:px-6 lg:px-[120px] lg:py-[80px]">
			<div className="flex w-full flex-col items-center gap-5 md:gap-6">
				<span className="font-semibold text-[11px] text-primary uppercase tracking-[3px]">
					{t('home.cta_label')}
				</span>
				<h2 className="text-center font-bold text-[30px] text-foreground md:text-[36px] lg:text-[52px]">
					{t('home.cta_title')}
				</h2>
				<p className="max-w-[520px] text-center text-muted-foreground text-sm md:text-base">
					{t('home.cta_description')}
				</p>
				<Link
					href="/sign-up"
					className="rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground text-sm transition-colors hover:bg-primary/85 md:px-7 md:py-[14px]"
				>
					{t('home.cta_button')}
				</Link>
			</div>
		</section>
	);
};
