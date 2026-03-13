import { ImageIcon, Loader2Icon, Trash2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useConfirm } from '@/hooks/use-confirm';
import { useImageUpload } from '@/hooks/use-image-upload';

import { useRemoveOrgImage } from '../../hooks/use-remove-org-image';
import { useUpdateOrg } from '../../hooks/use-update-org';
import { OrgAvatar } from './org-avatar';

interface OrgImageSelectProps {
	orgId: string;
	orgImage?: string | null;
	orgName: string;
}

export const OrgImageSelect = ({
	orgId,
	orgImage,
	orgName,
}: OrgImageSelectProps) => {
	const t = useTranslations();
	const [RemoveConfirmDialog, confirmRemove] = useConfirm({
		title: t('common.sure'),
		message: t('common.cannot_udone'),
		action: t('actions.remove'),
		variant: 'destructive',
	});

	const updateOrg = useUpdateOrg();
	const removeImage = useRemoveOrgImage();

	const { inputRef, isUploading, openFilePicker, handleChange } =
		useImageUpload({
			storageKey: `orgs/${orgId}`,
			onSuccess: url => {
				updateOrg.mutate({ id: orgId, data: { image: url } });
			},
		});

	const onRemoveImage = async () => {
		const ok = await confirmRemove();
		if (!ok) return;

		removeImage.mutate({ id: orgId });
	};

	const isUpload = isUploading || updateOrg.isPending;
	const isPending = isUploading || updateOrg.isPending || removeImage.isPending;

	return (
		<>
			<RemoveConfirmDialog />
			<div className="flex items-center gap-4">
				<OrgAvatar size="2xl" imageUrl={orgImage} name={orgName} />
				<div className="flex flex-col gap-3">
					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled={isPending}
						onClick={openFilePicker}
					>
						{isUpload ? (
							<Loader2Icon className="animate-spin" />
						) : (
							<ImageIcon />
						)}
						{isUpload
							? t('common.uploading')
							: t(orgImage ? 'actions.change' : 'actions.upload')}
					</Button>
					{orgImage && (
						<Button
							type="button"
							variant="destructive"
							size="sm"
							disabled={isPending}
							onClick={onRemoveImage}
						>
							<Trash2Icon />
							{t('actions.remove')}
						</Button>
					)}
				</div>
			</div>
			<input
				ref={inputRef}
				type="file"
				accept="image/jpeg,image/png,image/webp"
				className="hidden"
				onChange={handleChange}
			/>
		</>
	);
};

export const OrgImageSelectSkeleton = () => {
	return (
		<div className="flex items-center gap-4">
			<Skeleton className="size-20 rounded-md" />
			<div className="flex flex-col gap-3">
				<Skeleton className="h-8 w-24" />
				<Skeleton className="h-8 w-24" />
			</div>
		</div>
	);
};
