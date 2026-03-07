import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { getMessage } from '@/lib/utils/get-message';
import { useTRPC } from '@/trpc/client';

export const useUpdateTask = () => {
	const t = useTranslations();
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	return useMutation(
		trpc.tasks.update.mutationOptions({
			onSuccess: async data => {
				await queryClient.invalidateQueries({
					queryKey: trpc.projects.getByOrganization.queryKey({
						organizationId: data.organizationId,
					}),
				});

				await queryClient.invalidateQueries({
					queryKey: trpc.projects.getAnalytics.queryKey({
						projectId: data.projectId,
					}),
				});

				await queryClient.invalidateQueries({
					queryKey: trpc.tasks.getByProject.queryKey({
						projectId: data.projectId,
					}),
				});

				await queryClient.invalidateQueries({
					queryKey: trpc.tasks.getById.queryKey({
						taskId: data.id,
					}),
				});

				//  await queryClient.invalidateQueries({
				//   queryKey: trpc.projects.getByUser.queryKey()
				// }) // TODO:

				toast.success(t('tasks.updated'));
			},
			onError: error => {
				const message = getMessage(error.message, t);
				toast.error(message);
			},
		}),
	);
};
