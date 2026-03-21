export const PRODUCT_IDS = {
	basic: process.env.POLAR_BASIC_PRODUCT_ID,
	pro: process.env.POLAR_PRO_PRODUCT_ID,
} as const;

export const PRODUCT_PRICE = {
	free: 0,
	basic: 9,
	pro: 29,
} as const;
