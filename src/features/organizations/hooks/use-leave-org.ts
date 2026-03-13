import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { getMessage } from '@/lib/utils/get-message';
import { useTRPC } from '@/trpc/client';

export const useLeaveOrg = () => {
	const t = useTranslations();
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation(
		trpc.organizations.leave.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: trpc.organizations.getMany.queryKey(),
				});

				router.push('/user');
			},
			onError: error => {
				toast.error(getMessage(error.message, t));
			},
		}),
	);
};
