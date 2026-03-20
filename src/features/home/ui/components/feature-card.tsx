import { useTranslations } from 'next-intl';

import type { Feature } from '../../configs/features';

interface FeatureCardProps {
	feature: Feature;
}

export const FeatureCard = ({ feature }: FeatureCardProps) => {
	const t = useTranslations();

	return (
		<div className="flex h-full flex-col gap-3 bg-card p-5 transition-colors hover:bg-card/80 md:gap-4 md:p-7">
			<feature.icon className="text-primary" size={24} />
			<h3 className="font-semibold text-[15px] text-foreground md:text-base">
				{t(feature.title)}
			</h3>
			<p className="text-[13px] text-muted-foreground leading-relaxed md:text-sm">
				{t(feature.description)}
			</p>
		</div>
	);
};
