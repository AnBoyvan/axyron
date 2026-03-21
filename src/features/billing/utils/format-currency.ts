export const formatCurrency = (amount: number, locale = 'en-US'): string => {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 0,
	}).format(amount);
};
