import { acceptInvite } from '@/features/organizations/procedures/accept-invite';
import { create } from '@/features/organizations/procedures/create';
import { getById } from '@/features/organizations/procedures/get-by-id';
import { getByInviteCode } from '@/features/organizations/procedures/get-by-invite-code';
import { getMany } from '@/features/organizations/procedures/get-many';
import { getMembers } from '@/features/organizations/procedures/get-members';
import { leave } from '@/features/organizations/procedures/leave';
import { remove } from '@/features/organizations/procedures/remove';
import { removeMember } from '@/features/organizations/procedures/remove-member';
import { resetInviteCode } from '@/features/organizations/procedures/reset-invite-code';
import { update } from '@/features/organizations/procedures/update';
import { updateMember } from '@/features/organizations/procedures/update-member';
import { updateRule } from '@/features/organizations/procedures/update-rule';

import { createTRPCRouter } from '../init';
//TODO:
export const organizationsRouter = createTRPCRouter({
	create,
	update,
	updateRule,
	remove,
	// leave,
	// removeMember,
	resetInviteCode,
	// updateMember,
	getById,
	getMany,
	getByInviteCode,
	getMembers,
	acceptInvite,
});
