import { CheckIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import type { PaidPlanKey, PlanItem, PlanKey } from '../../configs/plan-config';
import { formatCurrency } from '../../utils/format-currency';

interface PlanCardProps {
	plan: PlanItem;
	currentPlan?: PlanKey;
	onUpgrade: (key: PaidPlanKey) => void;
	onPortal: () => void;
	isCheckoutPending: boolean;
	isPortalPending: boolean;
}

export const PlanCard = ({
	plan,
	currentPlan,
	onUpgrade,
	onPortal,
	isCheckoutPending,
	isPortalPending,
}: PlanCardProps) => {
	const t = useTranslations();

	const isCurrent = currentPlan === plan.key;
	const isPaid = plan.key !== 'free';
	const isUpgrade =
		(currentPlan === 'free' && isPaid) ||
		(currentPlan === 'basic' && plan.key === 'pro');
	const isDowngrade =
		(currentPlan === 'pro' && plan.key === 'basic') ||
		(currentPlan !== 'free' && plan.key === 'free');

	return (
		<Card className={isCurrent ? 'border-primary' : ''}>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="capitalize">{plan.key}</CardTitle>
					{isCurrent && <Badge>{t('billing.current_plan')}</Badge>}
				</div>
				<CardDescription>
					<span className="font-bold text-2xl text-foreground">
						{formatCurrency(plan.price)}
					</span>
					{plan.price > 0 && (
						<span className="text-muted-foreground">
							{' '}
							/ {t('billing.per_month')}
						</span>
					)}
				</CardDescription>
			</CardHeader>

			<CardContent className="flex flex-col gap-2">
				{plan.features.map(feature => (
					<div key={feature} className="flex items-center gap-2 text-sm">
						<CheckIcon className="size-4 shrink-0 text-primary" />
						{feature}
					</div>
				))}
			</CardContent>

			<CardFooter className="mt-auto">
				{isCurrent && plan.key === 'free' ? null : isCurrent ? (
					<Button
						variant="outline"
						className="w-full"
						onClick={onPortal}
						disabled={isPortalPending}
					>
						{t('billing.manage')}
					</Button>
				) : isUpgrade ? (
					<Button
						className="w-full"
						onClick={() => onUpgrade(plan.key as PaidPlanKey)}
						disabled={isCheckoutPending}
					>
						{t('billing.upgrade')}
					</Button>
				) : isDowngrade ? (
					<Button
						variant="outline"
						className="w-full"
						onClick={onPortal}
						disabled={isPortalPending}
					>
						{t('billing.downgrade')}
					</Button>
				) : null}
			</CardFooter>
		</Card>
	);
};

export const PlanCardSkeleton = () => {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<Skeleton className="h-5 w-16" />
				</div>
				<Skeleton className="h-8 w-20" />
			</CardHeader>
			<CardContent className="flex flex-col gap-2">
				{Array.from({ length: 2 }).map((_, i) => (
					<div key={i} className="flex items-center gap-2">
						<Skeleton className="size-4 shrink-0 rounded-full" />
						<Skeleton className="h-4 w-32" />
					</div>
				))}
			</CardContent>
			<CardFooter>
				<Skeleton className="h-9 w-full" />
			</CardFooter>
		</Card>
	);
};
