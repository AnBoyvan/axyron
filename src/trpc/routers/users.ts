import { getProfile } from '@/features/users/procedures/get-profile';
import { removeImage } from '@/features/users/procedures/remove-image';
import { updatePassword } from '@/features/users/procedures/update-password';
import { updateProfile } from '@/features/users/procedures/update-profile';

import { createTRPCRouter } from '../init';

export const usersRouter = createTRPCRouter({
	updateProfile,
	updatePassword,
	removeImage,
	getProfile,
});
