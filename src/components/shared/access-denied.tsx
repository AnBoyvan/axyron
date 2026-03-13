import { ShieldXIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Card, CardContent } from '@/components/ui/card';

export const AccessDenied = () => {
	const t = useTranslations();

	return (
		<Card className="w-full max-w-md">
			<CardContent className="flex flex-col items-center gap-4 pt-6">
				<ShieldXIcon className="size-12 text-destructive" />
				<div className="flex flex-col items-center gap-1 text-center">
					<h1 className="font-semibold text-xl">{t('common.access_denied')}</h1>
				</div>
			</CardContent>
		</Card>
	);
};
