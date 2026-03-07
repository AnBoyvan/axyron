import { addAssignees } from '@/features/tasks/procedures/add-assignees';
import { addSubtask } from '@/features/tasks/procedures/add-subtask';
import { create } from '@/features/tasks/procedures/create';
import { getById } from '@/features/tasks/procedures/get-by-id';
import { getByProject } from '@/features/tasks/procedures/get-by-project';
import { getByUser } from '@/features/tasks/procedures/get-by-user';
import { remove } from '@/features/tasks/procedures/remove';
import { removeAssignee } from '@/features/tasks/procedures/remove-assignee';
import { removeSubtask } from '@/features/tasks/procedures/remove-subtask';
import { reorderSubtasks } from '@/features/tasks/procedures/reorder-subtasks';
import { subtaskCompletedToggle } from '@/features/tasks/procedures/subtask-completed-toggle';
import { update } from '@/features/tasks/procedures/update';
import { updateSubtask } from '@/features/tasks/procedures/update-subtask';

import { createTRPCRouter } from '../init';
// TODO:
export const tasksRouter = createTRPCRouter({
	create,
	update,
	remove,
	getById,
	getByProject,
	// getByUser,
	// addSubtask,
	// updateSubtask,
	// subtaskCompletedToggle,
	// reorderSubtasks,
	// removeSubtask,
	addAssignees,
	removeAssignee,
});
