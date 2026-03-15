import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { getMessage } from '@/lib/utils/get-message';
import { useTRPC } from '@/trpc/client';

export const useRemoveMeetingComment = () => {
	const t = useTranslations();
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	return useMutation(
		trpc.meetingComments.remove.mutationOptions({
			onSuccess: async data => {
				await queryClient.invalidateQueries({
					queryKey: trpc.meetingComments.getByMeeting.infiniteQueryKey({
						meetingId: data.meetingId,
					}),
				});

				if (data.organizationId) {
					await queryClient.invalidateQueries({
						queryKey: trpc.meetings.getByOrganization.queryKey({
							organizationId: data.organizationId,
						}),
					});
				}

				await queryClient.invalidateQueries({
					queryKey: trpc.meetings.getByUser.queryKey(),
				});
			},
			onError: error => {
				const message = getMessage(error.message, t);
				toast.error(message);
			},
		}),
	);
};
