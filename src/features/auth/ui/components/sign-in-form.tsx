import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { OctagonAlertIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { InputField } from '@/components/form/input-field';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { authClient } from '@/lib/auth/auth-client';

import { type SignInSchema, signInSchema } from '../../schemas/sign-in-schema';
import { SocialAuth } from './social-auth';

export const SignInForm = () => {
	const t = useTranslations();
	const router = useRouter();

	const [error, setError] = useState<string | null>(null);
	const [isPending, setIsPending] = useState(false);

	const form = useForm<SignInSchema>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = (data: SignInSchema) => {
		setError(null);
		setIsPending(true);

		authClient.signIn.email(
			{
				email: data.email,
				password: data.password,
				callbackURL: '/',
			},
			{
				onSuccess: () => {
					setIsPending(false);
					router.push('/');
				},
				onError: ctx => {
					setIsPending(false);
					setError(ctx.error.message);
				},
			},
		);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
				<div className="flex flex-col gap-6">
					<div className="flex flex-col items-center text-center">
						<h1 className="font-bold text-2xl">{t('auth.sign_in_title')}</h1>
						<p className="text-balance text-muted-foreground">
							{t('auth.sign_in_description')}
						</p>
					</div>
					<div className="grid gap-3">
						<InputField
							control={form.control}
							name="email"
							label="Email"
							type="email"
							placeholder="example@mail.com"
						/>
						<InputField
							control={form.control}
							name="password"
							label="Password"
							type="password"
							placeholder="********"
						/>
					</div>
					{!!error && (
						<Alert className="border-none bg-destructive/10">
							<OctagonAlertIcon className="!text-destructive size-4" />
							<AlertTitle>{error}</AlertTitle>
						</Alert>
					)}
					<Button type="submit" disabled={isPending} className="w-full">
						{t('auth.sign_in')}
					</Button>
					<div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
						<span className="relative z-10 bg-card px-2 text-muted-foreground">
							{t('auth.continue_with')}
						</span>
					</div>
					<SocialAuth
						disabled={isPending}
						setError={setError}
						setIsPending={setIsPending}
					/>
					<div className="text-center text-sm">
						{t('auth.dont_have_account')}
						<Link
							href="/sign-up"
							className="underline underline-offset-4 hover:text-primary"
						>
							{t('auth.sign_up')}
						</Link>
					</div>
				</div>
			</form>
		</Form>
	);
};
