import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { getMessage } from '@/lib/utils/get-message';
import { useTRPC } from '@/trpc/client';

export const useResetInviteCode = () => {
	const t = useTranslations();
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	return useMutation(
		trpc.organizations.resetInviteCode.mutationOptions({
			onSuccess: async data => {
				await queryClient.invalidateQueries({
					queryKey: trpc.organizations.getById.queryKey({
						id: data.organizationId,
					}),
				});

				await queryClient.invalidateQueries({
					queryKey: trpc.organizations.getMany.queryKey(),
				});

				toast.success(t('orgs.reset_code_success'));
			},
			onError: error => {
				toast.error(getMessage(error.message, t));
			},
		}),
	);
};
