import { parseAsIsoDateTime, useQueryStates } from 'nuqs';

import { getCurrentWeekRange } from '@/lib/utils/get-current-week-range';

export const useMeetingsFilters = () => {
	const { start, end } = getCurrentWeekRange();

	return useQueryStates({
		dateFrom: parseAsIsoDateTime.withDefault(start),
		dateTo: parseAsIsoDateTime.withDefault(end),
	});
};
