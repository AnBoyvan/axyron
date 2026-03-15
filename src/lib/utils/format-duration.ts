import { formatDuration as fnsFormatDuration, type Locale } from 'date-fns';

export const formatDuration = (minutes: number, locale: Locale): string => {
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;

	return fnsFormatDuration(
		{ hours: hours || undefined, minutes: mins || undefined },
		{ locale },
	);
};
