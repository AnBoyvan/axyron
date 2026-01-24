import { useTranslations } from 'next-intl';

export default function Home() {
	const t = useTranslations();
	return <div className="">{t('general.hello')}</div>;
}
