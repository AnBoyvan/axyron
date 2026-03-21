'use client';

import { Suspense } from 'react';

import { CustomErrorBoundary } from '@/components/shared/custom-error-boundary';
import { ViewWrapper } from '@/components/shared/view-wrapper';

import {
	BillingSection,
	BillingSectionSkeleton,
} from '../sections/billing-section';

interface BillingViewProps {
	orgId: string;
}

export const BillingView = ({ orgId }: BillingViewProps) => {
	return (
		<ViewWrapper>
			<CustomErrorBoundary>
				<Suspense fallback={<BillingSectionSkeleton />}>
					<BillingSection orgId={orgId} />
				</Suspense>
			</CustomErrorBoundary>
		</ViewWrapper>
	);
};
