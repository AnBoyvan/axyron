import type { TranslationKey } from 'next-intl';

type HomeNavItem = {
	href: string;
	label: TranslationKey;
};

export const homeNav: HomeNavItem[] = [
	{ href: '#features', label: 'common.features' },
	{ href: '#pricing', label: 'common.pricing' },
];
