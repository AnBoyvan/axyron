import { useTaskById } from '../../hooks/use-task-by-id';
import { Subtasks, SubtasksSkeleton } from '../components/subtasks';
import { TaskDetails, TaskDetailsSkeleton } from '../components/task-details';
import { TaskHeader, TaskHeaderSkeleton } from '../components/task-header';

interface TaskMainSectionProps {
	taskId: string;
	openActivities: (open: boolean) => void;
}

export const TaskMainSection = ({
	taskId,
	openActivities,
}: TaskMainSectionProps) => {
	const { data } = useTaskById(taskId);
	return (
		<div className="flex flex-col">
			<TaskHeader task={data} openActivities={openActivities} />
			<TaskDetails task={data} />
			<Subtasks
				taskId={data.id}
				subtasks={data.subtasks}
				permissions={data.permissions}
			/>
		</div>
	);
};

export const TaskMainSectionSkeleton = () => {
	return (
		<div className="flex flex-col">
			<TaskHeaderSkeleton />
			<TaskDetailsSkeleton />
			<SubtasksSkeleton />
		</div>
	);
};
