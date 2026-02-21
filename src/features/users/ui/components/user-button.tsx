'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { LogOutIcon, UserPenIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { authClient } from '@/lib/auth/auth-client';

import { userNav } from '../../configs/user-nav';
import { UserAvatar } from './user-avatar';

export const UserButton = () => {
	const t = useTranslations();
	const router = useRouter();
	const { data, isPending } = authClient.useSession();

	const handleLogout = () => {
		authClient.signOut({
			fetchOptions: { onSuccess: () => router.push('/') },
		});
	};

	if (isPending || !data?.user) {
		return <Skeleton className="size-8 rounded-full" />;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="">
				<UserAvatar imageUrl={data.user.image} name={data.user.name} />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" side="bottom" className="w-72">
				<DropdownMenuLabel className="flex w-full items-center gap-2">
					<UserAvatar
						imageUrl={data.user.image}
						name={data.user.name}
						size="lg"
					/>
					<div className="flex flex-col">
						<span className="truncate font-medium text-lg">
							{data.user.name}
						</span>
						<span className="truncate font-normal text-muted-foreground text-sm">
							{data.user.email}
						</span>
					</div>
				</DropdownMenuLabel>
				<Separator />
				<DropdownMenuItem
					asChild
					className="flex h-9 cursor-pointer items-center"
				>
					<Link href="/user/profile">
						<UserPenIcon className="size-4" />
						{t('users.profile')}
					</Link>
				</DropdownMenuItem>
				{userNav.map(item => (
					<DropdownMenuItem
						key={item.label}
						asChild
						className="flex h-9 cursor-pointer items-center"
					>
						<Link href={`/user${item.link}`}>
							<item.icon className="size-4" />
							{t(item.label)}
						</Link>
					</DropdownMenuItem>
				))}
				<Separator />
				<DropdownMenuItem
					className="items-centern flex h-9 cursor-pointer"
					onClick={handleLogout}
					variant="destructive"
				>
					<LogOutIcon className="size-4" />
					{t('auth.logout')}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
