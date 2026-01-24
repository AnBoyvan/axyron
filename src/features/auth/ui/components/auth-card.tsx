/** biome-ignore-all lint/a11y/useValidAnchor: do this later */
import { useTranslations } from 'next-intl';

import { Card, CardContent } from '@/components/ui/card';

interface AuthCardProps {
	children: React.ReactNode;
}

export const AuthCard = ({ children }: AuthCardProps) => {
	const t = useTranslations();

	return (
		<div className="flex flex-col gap-6">
			<Card className="overflow-hidden p-0">
				<CardContent className="grid p-0 md:grid-cols-2">
					{children}
					<div className="relative hidden flex-col items-center justify-center bg-radial from-[#1E1173] to-[#0A0124] md:flex">
						<img src="/logo.svg" alt="Logo" className="size-[92px]" />
						<p className="font-goldman font-semibold text-4xl text-[#3B82F6]">
							{t('general.app_name')}
						</p>
					</div>
				</CardContent>
			</Card>
			<div className="text-balance text-center text-muted-foreground text-xs *:[a]:underline *:[a]:underline-offset-4 *:[a]:transition-all *:[a]:hover:text-primary">
				{t('auth.agree')}
				<a href="#">{t('general.terms')}</a>
				{t('common.and')}
				<a href="#">{t('general.privacy')}</a>
			</div>
		</div>
	);
};
