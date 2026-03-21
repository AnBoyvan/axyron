import type { Translator } from 'next-intl';

import type { Organization } from '@/features/organizations/types';
import { PLANS } from '@/lib/polar/plans';

import { PRODUCT_PRICE } from '../constants';

export type PlanKey = Organization['plan'];
export type PaidPlanKey = 'basic' | 'pro';

export type PlanItem = {
	key: PlanKey;
	price: number;
	features: string[];
};

export const planConfig = (t: Translator): PlanItem[] => [
	{
		key: 'free',
		price: PRODUCT_PRICE.free,
		features: [
			t('billing.members_limit', { count: PLANS.free.maxMembers }),
			t('billing.projects_limit', { count: PLANS.free.maxProjects }),
		],
	},
	{
		key: 'basic' as const,
		price: PRODUCT_PRICE.basic,
		features: [
			t('billing.members_limit', { count: PLANS.basic.maxMembers }),
			t('billing.projects_limit', { count: PLANS.basic.maxProjects }),
		],
	},
	{
		key: 'pro' as const,
		price: PRODUCT_PRICE.pro,
		features: [
			t('billing.members_limit_unlimited'),
			t('billing.projects_limit_unlimited'),
		],
	},
];
