import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { getMessage } from '@/lib/utils/get-message';
import { useTRPC } from '@/trpc/client';

export const useRemoveProfileImage = () => {
	const t = useTranslations();
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	return useMutation(
		trpc.user.removeImage.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: trpc.user.getProfile.queryKey(),
				});

				toast.success(t('users.updated'));
			},
			onError: error => {
				const message = getMessage(error.message, t);
				toast.error(message);
			},
		}),
	);
};
