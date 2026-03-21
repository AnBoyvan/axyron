import { createCheckout } from '@/features/billing/procedures/create-checkout';
import { createPortal } from '@/features/billing/procedures/create-portal';

import { createTRPCRouter } from '../init';

export const billingRouter = createTRPCRouter({
	createCheckout,
	createPortal,
});
