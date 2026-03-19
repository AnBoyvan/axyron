import { ImageIcon, Loader2Icon, Trash2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useConfirm } from '@/hooks/use-confirm';
import { useImageUpload } from '@/hooks/use-image-upload';

import { useProfile } from '../../hooks/use-profile';
import { useRemoveProfileImage } from '../../hooks/use-remove-profile-image';
import { useUpdateProfile } from '../../hooks/use-update-profile';
import { UserAvatar } from './user-avatar';

export const UserImageSelect = () => {
	const t = useTranslations();
	const [RemoveConfirmDialog, confirmRemove] = useConfirm({
		title: t('common.sure'),
		message: t('common.cannot_udone'),
		action: t('actions.remove'),
		variant: 'destructive',
	});

	const { data } = useProfile();
	const updateProfile = useUpdateProfile();
	const removeImage = useRemoveProfileImage();

	const { inputRef, isUploading, openFilePicker, handleChange } =
		useImageUpload({
			storageKey: `users/${data.id}`,
			onSuccess: url => {
				updateProfile.mutate({ image: url, name: data.name });
			},
		});

	const onRemoveImage = async () => {
		const ok = await confirmRemove();
		if (!ok) return;

		removeImage.mutate();
	};

	const isUpload = isUploading || updateProfile.isPending;
	const isPending =
		isUploading || updateProfile.isPending || removeImage.isPending;

	return (
		<>
			<RemoveConfirmDialog />
			<div className="flex items-center gap-4">
				<UserAvatar size="2xl" imageUrl={data.image} name={data.name} />
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
							: t(data.image ? 'actions.change' : 'actions.upload')}
					</Button>
					{data.image && (
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

export const UserImageSelectSkeleton = () => {
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
