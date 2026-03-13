import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { getMessage } from '@/lib/utils/get-message';
import { useTRPC } from '@/trpc/client';

export const useRemoveOrgImage = () => {
	const t = useTranslations();
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	return useMutation(
		trpc.organizations.removeImage.mutationOptions({
			onSuccess: async data => {
				await queryClient.invalidateQueries({
					queryKey: trpc.organizations.getById.queryKey({
						id: data.id,
					}),
				});

				await queryClient.invalidateQueries({
					queryKey: trpc.organizations.getMany.queryKey(),
				});

				await queryClient.invalidateQueries({
					queryKey: trpc.organizations.getMembers.queryKey({
						organizationId: data.id,
					}),
				});

				toast.success(t('orgs.updated'));
			},
			onError: error => {
				toast.error(getMessage(error.message, t));
			},
		}),
	);
};
