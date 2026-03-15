export const getCurrentDayRange = (): { start: Date; end: Date } => {
	const now = new Date();

	const start = new Date(now);
	start.setHours(0, 0, 0, 0);

	const end = new Date(now);
	end.setHours(23, 59, 59, 999);

	return { start, end };
};
