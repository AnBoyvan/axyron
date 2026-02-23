import { useTranslations } from 'next-intl';
import { GiSandsOfTime } from 'react-icons/gi';

export const Developing = () => {
	const t = useTranslations();

	return (
		<div className="flex h-full flex-1 flex-col items-center justify-center gap-y-4 text-muted-foreground">
			<GiSandsOfTime className="size-10" />
			<p className="text-xl">{t('general.in_development')}</p>
		</div>
	);
};
