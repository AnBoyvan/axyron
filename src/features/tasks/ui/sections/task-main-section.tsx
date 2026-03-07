import { useTaskById } from '../../hooks/use-task-by-id';
import { TaskDetails } from '../components/task-details';
import { TaskHeader } from '../components/task-header';

interface TaskViewProps {
	taskId: string;
}

export const TaskMainSection = ({ taskId }: TaskViewProps) => {
	const { data } = useTaskById(taskId);
	return (
		<div className="flex flex-col">
			<TaskHeader task={data} />
			<TaskDetails task={data} />
		</div>
	);
};
