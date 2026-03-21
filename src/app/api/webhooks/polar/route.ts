import { type NextRequest, NextResponse } from 'next/server';

import {
	validateEvent,
	WebhookVerificationError,
} from '@polar-sh/sdk/webhooks';
import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { organizations } from '@/db/schema/organizations';

export const POST = async (req: NextRequest) => {
	const body = await req.text();

	const headersRecord: Record<string, string> = {};
	req.headers.forEach((value, key) => {
		headersRecord[key] = value;
	});

	let event: ReturnType<typeof validateEvent>;

	try {
		event = validateEvent(
			body,
			headersRecord,
			process.env.POLAR_WEBHOOK_SECRET,
		);
	} catch (e) {
		if (e instanceof WebhookVerificationError) {
			return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
		}
		return NextResponse.json({ error: 'Bad request' }, { status: 400 });
	}

	const { type, data } = event;

	if (type === 'subscription.active') {
		const organizationId = data.metadata?.organizationId as string | undefined;
		if (!organizationId) {
			return NextResponse.json(
				{ error: 'Missing organizationId in metadata' },
				{ status: 400 },
			);
		}

		const productId = data.productId;
		const plan =
			productId === process.env.POLAR_BASIC_PRODUCT_ID
				? 'basic'
				: productId === process.env.POLAR_PRO_PRODUCT_ID
					? 'pro'
					: null;

		if (!plan) {
			return NextResponse.json({ error: 'Unknown product' }, { status: 400 });
		}

		await db
			.update(organizations)
			.set({ plan, polarSubscriptionId: data.id })
			.where(eq(organizations.id, organizationId));
	}

	if (type === 'subscription.canceled' || type === 'subscription.revoked') {
		const organizationId = data.metadata?.organizationId as string | undefined;
		if (!organizationId) {
			return NextResponse.json(
				{ error: 'Missing organizationId in metadata' },
				{ status: 400 },
			);
		}

		await db
			.update(organizations)
			.set({ plan: 'free', polarSubscriptionId: null })
			.where(eq(organizations.id, organizationId));
	}

	return NextResponse.json({ received: true });
};
