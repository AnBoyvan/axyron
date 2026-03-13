import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth/auth';

interface AuthLayoutProps {
	children: React.ReactNode;
}

const AuthLayout = async ({ children }: AuthLayoutProps) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (session?.user) {
		redirect('/user');
	}

	return (
		<div className="flex min-h-svh flex-col items-center justify-center bg-muted/30 p-6 md:p-10">
			<div className="w-full max-w-sm md:max-w-3xl">{children}</div>
		</div>
	);
};

export default AuthLayout;
