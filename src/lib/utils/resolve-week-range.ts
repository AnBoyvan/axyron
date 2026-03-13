import { getCurrentWeekRange } from './get-current-week-range';

export function resolveDateRange(
	from?: Date,
	to?: Date,
): { dateFrom: Date; dateTo: Date } {
	const { start, end } = getCurrentWeekRange();

	return {
		dateFrom: from ?? start,
		dateTo: to ?? end,
	};
}
