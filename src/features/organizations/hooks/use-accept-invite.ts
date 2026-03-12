import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { getMessage } from '@/lib/utils/get-message';
import { useTRPC } from '@/trpc/client';

export const useAcceptInvite = () => {
	const t = useTranslations();
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation(
		trpc.organizations.acceptInvite.mutationOptions({
			onSuccess: async data => {
				await queryClient.invalidateQueries({
					queryKey: trpc.organizations.getById.queryKey({
						id: data.organizationId,
					}),
				});

				await queryClient.invalidateQueries({
					queryKey: trpc.organizations.getMany.queryKey(),
				});

				toast.success(t('orgs.invite_success'));

				router.push(`/org/${data.organizationId}/dashboard`);
			},
			onError: error => {
				toast.error(getMessage(error.message, t));
			},
		}),
	);
};
