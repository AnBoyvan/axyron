import Image from 'next/image';
import Link from 'next/link';

import { useTranslations } from 'next-intl';

export const HomeHero = () => {
	const t = useTranslations();

	return (
		<section className="flex flex-col items-center gap-5 bg-card px-4 pt-[60px] pb-[48px] md:px-6 md:pt-[80px] md:pb-[60px] lg:px-[120px] lg:pt-[100px] lg:pb-[80px]">
			<h1 className="max-w-[900px] text-center font-bold text-[36px] text-foreground leading-tight md:text-[48px] lg:text-[72px]">
				{t('home.hero_title')}
			</h1>
			<p className="max-w-[560px] text-center text-[15px] text-muted-foreground leading-relaxed md:text-[16px] lg:text-[18px]">
				{t('home.hero_description')}
			</p>
			<Link
				href="/sign-up"
				className="rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground text-sm transition-colors hover:bg-primary/85 md:px-7 md:py-[14px] md:text-[15px]"
			>
				{t('home.hero_cta')}
			</Link>
			<div className="mt-4 h-[220px] w-full overflow-hidden rounded-lg border border-border md:h-[380px] lg:h-[513px]">
				<Image
					src="/screenshot.png"
					alt={t('home.hero_screenshot_alt')}
					width={1231}
					height={513}
					className="h-full w-full object-cover object-top"
					priority
				/>
			</div>
		</section>
	);
};
