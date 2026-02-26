import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { getMessage } from '@/lib/utils/get-message';
import { useTRPC } from '@/trpc/client';

export const useRemoveProject = () => {
	const t = useTranslations();
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation(
		trpc.projects.remove.mutationOptions({
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
					t.rich('projects.restore_message', {
						projectName: data.name,
						b: chunks => <strong>{chunks}</strong>,
					}),
				);

				router.push(`/org/${data.organizationId}/projects`);
			},
			onError: error => {
				const message = getMessage(error.message, t);
				toast.error(message);
			},
		}),
	);
};
