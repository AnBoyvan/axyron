import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { getMessage } from '@/lib/utils/get-message';
import { useTRPC } from '@/trpc/client';

export const useAddProjectMembers = () => {
	const t = useTranslations();
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	return useMutation(
		trpc.projects.addMembers.mutationOptions({
			onSuccess: async data => {
				await queryClient.invalidateQueries({
					queryKey: trpc.projects.getById.queryKey({ id: data.projectId }),
				});

				await queryClient.invalidateQueries({
					queryKey: trpc.projects.getMembers.queryKey({
						projectId: data.projectId,
					}),
				});

				await queryClient.invalidateQueries({
					queryKey: trpc.tasks.getByProject.queryKey({
						projectId: data.projectId,
					}),
				});

				toast.success(t('members.added_members', { count: data.added }));
			},
			onError: error => {
				const message = getMessage(error.message, t);
				toast.error(message);
			},
		}),
	);
};
