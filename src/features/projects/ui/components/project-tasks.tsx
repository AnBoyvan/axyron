import { useTasksByProject } from '@/features/tasks/hooks/use-tasks-by-projects';
import { TasksFilter } from '@/features/tasks/ui/components/tasks-filter';

import { ProjectHeader } from './project-header';

interface ProjectTasksProps {
	projectId: string;
}

export const ProjectTasks = ({ projectId }: ProjectTasksProps) => {
	const {
		data: { tasks, project, permissions },
	} = useTasksByProject(projectId);

	return (
		<div className="flex flex-1 flex-col gap-4 lg:gap-8">
			<ProjectHeader
				projectId={projectId}
				orgId={project.organizationId}
				name={project.name}
				isArchived={project.archived}
				status={project.status}
				visibility={project.visibility}
				tab="tasks"
			/>
			<TasksFilter
				projectId={projectId}
				canCreate={permissions.canCreateTask}
			/>
		</div>
	);
};
