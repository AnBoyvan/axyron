import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { getMessage } from '@/lib/utils/get-message';
import { useTRPC } from '@/trpc/client';

export const useCreateCheckout = () => {
	const t = useTranslations();
	const trpc = useTRPC();

	return useMutation(
		trpc.billing.createCheckout.mutationOptions({
			onSuccess: ({ url }) => {
				window.location.href = url;
			},
			onError: error => {
				toast.error(getMessage(error.message, t));
			},
		}),
	);
};
