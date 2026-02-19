import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { getMessage } from '@/lib/utils/get-message';
import { useTRPC } from '@/trpc/client';

export const useCreateProject = () => {
	const t = useTranslations();
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation(
		trpc.projects.create.mutationOptions({
			onSuccess: async data => {
				await queryClient.invalidateQueries({
					queryKey: trpc.projects.getByOrganization.queryKey({
						organizationId: data.organizationId,
					}),
				});

				//  await queryClient.invalidateQueries({
				//   queryKey: trpc.projects.getByUser.queryKey()
				// }) // TODO:

				toast.success(
					`${t('common.project')} ${data.name} ${t('common.created')}`,
				);

				router.push(`/${data.organizationId}/projects/${data.id}`);
			},
			onError: error => {
				const message = getMessage(error.message, t);
				toast.error(message);
			},
		}),
	);
};
