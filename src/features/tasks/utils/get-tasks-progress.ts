interface GetTasksProgressProps {
	completed: number;
	total: number;
	cancelled: number;
}

export const getTasksProgress = ({
	completed,
	total,
	cancelled = 0,
}: GetTasksProgressProps) => {
	const active = Math.max(total - cancelled, 0);

	if (active === 0) return { active, progress: 0 };

	const percent = Math.round((completed / active) * 100);

	const progress = Math.min(100, Math.max(0, percent));

	return { active, progress };
};
