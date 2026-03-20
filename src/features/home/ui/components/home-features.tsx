import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils/cn';

import { features } from '../../configs/features';
import { FeatureCard } from './feature-card';

export const HomeFeatures = () => {
	const t = useTranslations();

	return (
		<section
			id="features"
			className="bg-background px-4 py-[60px] md:px-6 lg:px-[120px] lg:py-[80px]"
		>
			<div className="mb-8 flex flex-col items-center gap-2.5 md:mb-12 md:gap-3">
				<span className="font-semibold text-[11px] text-primary uppercase tracking-[3px]">
					{t('common.features')}
				</span>
				<h2 className="text-center font-bold text-[28px] text-foreground md:text-[32px] lg:max-w-[800px] lg:text-[40px]">
					{t('home.features_title')}
				</h2>
				<p className="max-w-[560px] text-center text-muted-foreground text-sm md:text-base">
					{t('home.features_subtitle')}
				</p>
			</div>

			<div className="divide-y divide-border border border-border">
				<div className="flex flex-col divide-y divide-border md:hidden">
					{features.map(f => (
						<FeatureCard key={f.title} feature={f} />
					))}
				</div>

				<div className="hidden grid-cols-2 divide-y divide-border md:grid lg:hidden">
					{[0, 2, 4].map(i => (
						<div key={i} className="contents">
							<div className="border-border border-r">
								<FeatureCard feature={features[i]} />
							</div>
							<FeatureCard feature={features[i + 1]} />
						</div>
					))}
				</div>

				<div className="hidden grid-cols-3 lg:grid">
					{[0, 3].map(rowStart => (
						<div key={rowStart} className="contents">
							{features.slice(rowStart, rowStart + 3).map((f, idx) => (
								<div
									key={f.title}
									className={cn(
										idx < 2 && 'border-border border-r',
										rowStart === 0 && 'border-border border-b',
									)}
								>
									<FeatureCard feature={f} />
								</div>
							))}
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
