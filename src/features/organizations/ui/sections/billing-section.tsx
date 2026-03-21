'use client';

import { useTranslations } from 'next-intl';

import { AccessDenied } from '@/components/shared/access-denied';
import { Skeleton } from '@/components/ui/skeleton';
import {
	type PaidPlanKey,
	planConfig,
} from '@/features/billing/configs/plan-config';
import { useCreateCheckout } from '@/features/billing/hooks/use-create-checkout';
import { useCreatePortal } from '@/features/billing/hooks/use-create-portal';
import {
	PlanCard,
	PlanCardSkeleton,
} from '@/features/billing/ui/components/plan-card';
import { useOrgById } from '@/features/organizations/hooks/use-org-by-id';

interface BillingSectionProps {
	orgId: string;
}

export const BillingSection = ({ orgId }: BillingSectionProps) => {
	const t = useTranslations();
	const { data: org } = useOrgById(orgId);

	const checkout = useCreateCheckout();
	const portal = useCreatePortal();

	if (!org.permissions.isAdmin) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<AccessDenied />
			</div>
		);
	}

	const plans = planConfig(t);

	const handleUpgrade = (key: PaidPlanKey) => {
		checkout.mutate({ organizationId: orgId, plan: key });
	};

	const handlePortal = () => {
		portal.mutate({ organizationId: orgId });
	};

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h2 className="font-semibold text-xl">{t('common.billing')}</h2>
				<p className="text-muted-foreground text-sm">
					{t('billing.description')}
				</p>
			</div>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				{plans.map(plan => (
					<PlanCard
						key={plan.key}
						plan={plan}
						currentPlan={org.plan}
						onUpgrade={handleUpgrade}
						onPortal={handlePortal}
						isCheckoutPending={checkout.isPending}
						isPortalPending={portal.isPending}
					/>
				))}
			</div>
		</div>
	);
};

export const BillingSectionSkeleton = () => {
	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1">
				<Skeleton className="h-7 w-32" />
				<Skeleton className="h-4 w-64" />
			</div>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				{Array.from({ length: 3 }).map((_, idx) => (
					<PlanCardSkeleton key={idx} />
				))}
			</div>
		</div>
	);
};
