import { type JSX, type ReactNode, useState } from 'react';

import { useTranslations } from 'next-intl';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { ButtonVariants } from '@/components/ui/button';

interface UseConfirmProps {
	title: string;
	message: ReactNode;
	media?: ReactNode;
	variant?: ButtonVariants;
	cancel?: string;
	action?: string;
}

export const useConfirm = ({
	title,
	message,
	media,
	variant,
	cancel,
	action,
}: UseConfirmProps): [() => JSX.Element, () => Promise<unknown>] => {
	const t = useTranslations();

	const [promise, setPromise] = useState<{
		resolve: (value: boolean) => void;
	} | null>(null);

	const confirm = () => {
		return new Promise(resolve => {
			setPromise({ resolve });
		});
	};

	const handleClose = () => {
		setPromise(null);
	};

	const handleCancel = () => {
		promise?.resolve(false);
		setPromise(null);
	};

	const handleConfirm = () => {
		promise?.resolve(true);
		setPromise(null);
	};

	const ConfirmDialog = () => (
		<AlertDialog open={promise !== null} onOpenChange={handleClose}>
			<AlertDialogContent size="sm">
				<AlertDialogHeader>
					{media && <AlertDialogMedia>{media}</AlertDialogMedia>}
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{message}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel variant="outline" onClick={handleCancel}>
						{cancel ? cancel : t('actions.cancel')}
					</AlertDialogCancel>
					<AlertDialogAction variant={variant} onClick={handleConfirm}>
						{action ? action : t('actions.confirm')}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);

	return [ConfirmDialog, confirm];
};
