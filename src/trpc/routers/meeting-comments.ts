import { create } from '@/features/meeting-comments/procedures/create';
import { getByMeeting } from '@/features/meeting-comments/procedures/get-by-meeting';
import { remove } from '@/features/meeting-comments/procedures/remove';
import { setReaction } from '@/features/meeting-comments/procedures/set-reaction';
import { update } from '@/features/meeting-comments/procedures/update';

import { createTRPCRouter } from '../init';

export const meetingCommentsRouter = createTRPCRouter({
	create,
	update,
	remove,
	getByMeeting,
	setReaction,
});
