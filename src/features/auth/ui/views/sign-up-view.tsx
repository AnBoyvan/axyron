'use client';

import { AuthCard } from '../components/auth-card';
import { SignUpForm } from '../components/sign-up-form';

export const SignUpView = () => {
	return (
		<AuthCard>
			<SignUpForm />
		</AuthCard>
	);
};
