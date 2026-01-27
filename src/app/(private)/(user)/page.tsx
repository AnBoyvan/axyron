'use client';

import { useRouter } from 'next/navigation';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserAvatar } from '@/features/user/ui/components/user-avatar';
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
			<SidebarTrigger />
			<div className="flex flex-col items-center gap-8 p-8">
				<UserAvatar name="Andrii" />
				<UserAvatar name="Andrii" size="xl" />
				<UserAvatar name="Andrii" size="lg" />
				<UserAvatar name="Andrii" size="sm" />
				<UserAvatar name="Andrii" size="xs" />
			</div>
		</div>
	);
}
