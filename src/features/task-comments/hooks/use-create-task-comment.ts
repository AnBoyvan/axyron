import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { getMessage } from '@/lib/utils/get-message';
import { useTRPC } from '@/trpc/client';

import { DEFAULT_TASK_COMMENTS_LIMIT } from '../constants';

export const useCreateTaskComment = () => {
	const t = useTranslations();
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	return useMutation(
		trpc.taskComments.create.mutationOptions({
			onSuccess: async data => {
				await queryClient.invalidateQueries({
					queryKey: trpc.taskComments.getByTask.infiniteQueryKey({
						limit: DEFAULT_TASK_COMMENTS_LIMIT,
						taskId: data.taskId,
					}),
				});

				if (data.parentId) {
					await queryClient.invalidateQueries({
						queryKey: trpc.taskComments.getByTask.infiniteQueryKey({
							taskId: data.taskId,
							parentId: data.parentId,
							limit: DEFAULT_TASK_COMMENTS_LIMIT,
						}),
					});
				}
			},
			onError: error => {
				const message = getMessage(error.message, t);
				toast.error(message);
			},
		}),
	);
};
