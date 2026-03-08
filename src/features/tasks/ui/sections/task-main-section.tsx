import { useTaskById } from '../../hooks/use-task-by-id';
import { Subtasks, SubtasksSkeleton } from '../components/subtasks';
import { TaskDetails, TaskDetailsSkeleton } from '../components/task-details';
import { TaskHeader, TaskHeaderSkeleton } from '../components/task-header';

interface TaskMainSectionProps {
	taskId: string;
}

export const TaskMainSection = ({ taskId }: TaskMainSectionProps) => {
	const { data } = useTaskById(taskId);
	return (
		<div className="flex flex-col">
			<TaskHeader task={data} />
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
