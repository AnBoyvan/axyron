import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { getMessage } from '@/lib/utils/get-message';
import { useTRPC } from '@/trpc/client';

import { DEFAULT_COMMENTS_LIMIT } from '../constants';

interface UseTaskCommentReactionToggleProps {
	taskId: string;
	parentId?: string | null;
}

export const useTaskCommentReactionToggle = ({
	taskId,
	parentId,
}: UseTaskCommentReactionToggleProps) => {
	const t = useTranslations();
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	return useMutation(
		trpc.taskComments.setReaction.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: trpc.taskComments.getByTask.infiniteQueryKey({
						limit: DEFAULT_COMMENTS_LIMIT,
						taskId: taskId,
					}),
				});

				if (parentId) {
					await queryClient.invalidateQueries({
						queryKey: trpc.taskComments.getByTask.infiniteQueryKey({
							taskId: taskId,
							parentId: parentId,
							limit: DEFAULT_COMMENTS_LIMIT,
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
