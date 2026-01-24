'use client';

import { useRouter } from 'next/navigation';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/auth-client';

export default function Home() {
	const t = useTranslations();
	const router = useRouter();

	const handleLogout = () => {
		authClient.signOut({
			fetchOptions: { onSuccess: () => router.push('/sign-in') },
		});
	};
	return (
		<div className="">
			<Button onClick={handleLogout}>Logout</Button>
		</div>
	);
}
