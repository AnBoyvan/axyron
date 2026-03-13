import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { getMessage } from '@/lib/utils/get-message';
import { useTRPC } from '@/trpc/client';

export const useCreateMeeting = () => {
	const t = useTranslations();
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	return useMutation(
		trpc.meetings.create.mutationOptions({
			onSuccess: async data => {
				await queryClient.invalidateQueries({
					queryKey: trpc.meetings.getByOrganization.queryKey({
						organizationId: data.organizationId,
					}),
				});

				toast.success(t('meetings.scheduled'));
			},
			onError: error => {
				const message = getMessage(error.message, t);
				toast.error(message);
			},
		}),
	);
};
