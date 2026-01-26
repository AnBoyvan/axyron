import { AlertCircleIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { getMessage } from '@/lib/utils/get-message';

interface ErrorStateProps {
	title: string;
	description?: string;
}

export const ErrorState = ({
	title,
	description = 'common.try_later',
}: ErrorStateProps) => {
	const t = useTranslations();

	const titleMessage = getMessage(title, t);
	const descrMessage = getMessage(description, t);

	return (
		<div className="flex flex-1 items-center justify-center px-8 py-4 text-foreground">
			<div className="flex flex-col items-center justify-center gap-y-6 rounded-lg bg-background p-10 shadow-sm">
				<AlertCircleIcon className="size-6 text-destructive" />
				<div className="flex flex-col gap-y-2 text-center">
					<h6 className="font-medium text-lg">{titleMessage}</h6>
					<p className="text-sm">{descrMessage}</p>
				</div>
			</div>
		</div>
	);
};
