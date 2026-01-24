'use client';

import { AuthCard } from '../components/auth-card';
import { SignInForm } from '../components/sign-in-form';

export const SignInView = () => {
	return (
		<AuthCard>
			<SignInForm />
		</AuthCard>
	);
};
