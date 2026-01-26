import { create } from '@/features/organizations/procedures/create';
import { getById } from '@/features/organizations/procedures/get-by-id';
import { getMany } from '@/features/organizations/procedures/get-many';
import { remove } from '@/features/organizations/procedures/remove';
import { update } from '@/features/organizations/procedures/update';
import { updateRule } from '@/features/organizations/procedures/update-rule';

import { createTRPCRouter } from '../init';

export const organizationsRouter = createTRPCRouter({
	create,
	getMany,
	getById,
	update,
	updateRule,
	remove,
});
