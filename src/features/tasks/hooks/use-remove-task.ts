import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { getMessage } from '@/lib/utils/get-message';
import { useTRPC } from '@/trpc/client';

export const useRemoveTask = () => {
	const t = useTranslations();
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation(
		trpc.tasks.remove.mutationOptions({
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

				router.push(`/org/${data.organizationId}/projects/${data.projectId}`);

				toast.success(
					`${t('common.task')} ${data.title} ${t('common.removed')}`,
				);
			},
			onError: error => {
				const message = getMessage(error.message, t);
				toast.error(message);
			},
		}),
	);
};
