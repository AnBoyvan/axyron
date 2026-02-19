import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { SignUpView } from '@/features/auth/ui/views/sign-up-view';
import { auth } from '@/lib/auth/auth';

const SignUpPage = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (session) {
		redirect('/');
	}

	return <SignUpView />;
};

export default SignUpPage;
