import { addMembers } from '@/features/projects/procedures/add-members';
import { create } from '@/features/projects/procedures/create';
import { getAnalytics } from '@/features/projects/procedures/get-analytics';
import { getArchived } from '@/features/projects/procedures/get-archived';
import { getById } from '@/features/projects/procedures/get-by-id';
import { getByOrganization } from '@/features/projects/procedures/get-by-organization';
import { getMembers } from '@/features/projects/procedures/get-members';
import { remove } from '@/features/projects/procedures/remove';
import { removeMember } from '@/features/projects/procedures/remove-member';
import { update } from '@/features/projects/procedures/update';
import { updateMember } from '@/features/projects/procedures/updateMember';

import { createTRPCRouter } from '../init';

export const projectsRouter = createTRPCRouter({
	create,
	getById,
	getByOrganization,
	getArchived,
	update,
	remove,
	addMembers,
	removeMember,
	updateMember,
	getMembers,
	getAnalytics,
});
