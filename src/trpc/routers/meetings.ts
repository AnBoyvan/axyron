import { addComment } from '@/features/meetings/procedures/add-comment';
import { changeStatus } from '@/features/meetings/procedures/change-status';
import { create } from '@/features/meetings/procedures/create';
import { editComment } from '@/features/meetings/procedures/edit-comment';
import { getById } from '@/features/meetings/procedures/get-by-id';
import { getByOrganization } from '@/features/meetings/procedures/get-by-organization';
import { getByUser } from '@/features/meetings/procedures/get-by-user';
import { invite } from '@/features/meetings/procedures/invite';
import { remove } from '@/features/meetings/procedures/remove';
import { removeComment } from '@/features/meetings/procedures/remove-comment';
import { removeMember } from '@/features/meetings/procedures/remove-member';
import { update } from '@/features/meetings/procedures/update';

import { createTRPCRouter } from '../init';
//TODO:
export const meetingsRouter = createTRPCRouter({
	create,
	// update,
	// remove,
	// getById,
	getByOrganization,
	// getByUser,
	changeStatus,
	// invite,
	// removeMember,
	// addComment,
	// editComment,
	// removeComment,
});
