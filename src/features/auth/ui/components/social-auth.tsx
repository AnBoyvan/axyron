import { FaGoogle } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/auth-client';

interface SocialAuthProps {
	disabled?: boolean;
	setError: (message: string | null) => void;
	setIsPending: (value: boolean) => void;
}

export const SocialAuth = ({
	disabled,
	setError,
	setIsPending,
}: SocialAuthProps) => {
	const handleClick = (provider: 'github' | 'google') => {
		setError(null);
		setIsPending(true);

		authClient.signIn.social(
			{
				provider,
				callbackURL: '/',
			},
			{
				onSuccess: () => {
					setIsPending(false);
				},
				onError: ctx => {
					setIsPending(false);
					setError(ctx.error.message);
				},
			},
		);

		setError(null);
		setIsPending(true);
	};

	return (
		<div className="grid grid-cols-1 gap-4">
			<Button
				type="button"
				variant="outline"
				disabled={disabled}
				onClick={() => handleClick('google')}
				className="w-full"
			>
				<FaGoogle />
				Google
			</Button>
		</div>
	);
};
