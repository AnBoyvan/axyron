import { type DbTaskStatus, TaskStatusEnum } from '../types';

interface ResolveTaskStatusProps {
	status: DbTaskStatus;
	dueDate: Date | string | null;
}

export const resolveTaskStatus = ({
	status,
	dueDate,
}: ResolveTaskStatusProps): TaskStatusEnum => {
	if (
		status !== 'completed' &&
		status !== 'cancelled' &&
		dueDate &&
		new Date(dueDate) < new Date()
	) {
		return TaskStatusEnum.overdue;
	}

	return TaskStatusEnum[status];
};
