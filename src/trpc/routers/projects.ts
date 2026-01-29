import { create } from '@/features/projects/procedures/create';
import { getArchived } from '@/features/projects/procedures/get-archived';
import { getById } from '@/features/projects/procedures/get-by-id';
import { getByOrganization } from '@/features/projects/procedures/get-by-organization';
import { remove } from '@/features/projects/procedures/remove';
import { update } from '@/features/projects/procedures/update';

import { createTRPCRouter } from '../init';

export const organizationsRouter = createTRPCRouter({
	create,
	getById,
	getByOrganization,
	getArchived,
	update,
	remove,
});
