import { useRef, useState } from 'react';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '@/lib/r2/constants';

type UseImageUploadOptions = {
	storageKey: string;
	onSuccess: (url: string) => void;
};

export const useImageUpload = ({
	storageKey,
	onSuccess,
}: UseImageUploadOptions) => {
	const t = useTranslations();
	const inputRef = useRef<HTMLInputElement>(null);

	const [isUploading, setIsUploading] = useState(false);

	const openFilePicker = () => inputRef.current?.click();

	const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		e.target.value = '';

		if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
			toast.error(t('common.invalid_file_type'));
			return;
		}

		if (file.size > MAX_IMAGE_SIZE) {
			toast.error(t('common.file_too_large'));
			return;
		}

		setIsUploading(true);
		try {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('key', storageKey);

			const res = await fetch('/api/images/upload', {
				method: 'POST',
				body: formData,
			});

			if (!res.ok) throw new Error();

			const { url } = await res.json();
			onSuccess(url);
		} catch {
			toast.error(t('common.smth_wrong'));
		} finally {
			setIsUploading(false);
		}
	};

	return { inputRef, isUploading, openFilePicker, handleChange };
};
