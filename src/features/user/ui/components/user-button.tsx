import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
	ChevronDownIcon,
	LoaderIcon,
	LogOutIcon,
	UserPenIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { authClient } from '@/lib/auth/auth-client';

import { UserAvatar } from './user-avatar';

export const UserButton = () => {
	const t = useTranslations();
	const router = useRouter();
	const isMobile = useIsMobile();
	const { data, isPending } = authClient.useSession();

	const handleLogout = () => {
		authClient.signOut({
			fetchOptions: { onSuccess: () => router.push('/') },
		});
	};
	if (isPending || !data?.user) {
		return (
			<div className="flex h-14 w-full items-center justify-between gap-2 overflow-hidden rounded-lg border bg-secondary p-2 transition-colors hover:bg-secondary/80">
				<div className="flex size-9 items-center justify-center rounded-full border bg-muted">
					<LoaderIcon className="size-5 animate-spin text-muted-foreground" />
				</div>
				<div className="flex min-w-0 flex-1 flex-col gap-2 overflow-hidden text-left">
					<Skeleton className="h-3 w-32" />
					<Skeleton className="h-2.5 w-40 bg-accent/60" />
				</div>
			</div>
		);
	}

	if (isMobile) {
		return (
			<Drawer>
				<DrawerTrigger className="flex w-full items-center justify-between gap-2 overflow-hidden rounded-lg border bg-secondary p-2 text-sidebar-foreground transition-colors hover:bg-secondary/80">
					<UserAvatar name={data.user.name} />
					<div className="flex min-w-0 flex-1 flex-col gap-0.5 overflow-hidden text-left">
						<p className="w-full truncate text-secondary-foreground text-sm">
							{data.user.name}
						</p>
						<p className="w-full truncate text-muted-foreground text-xs">
							{data.user.email}
						</p>
					</div>
				</DrawerTrigger>
				<DrawerContent>
					<DrawerHeader className="flex-col items-center justify-center gap-3">
						<UserAvatar size="lg" name={data.user.name} />
						<div className="flex flex-col gap-1.5">
							<DrawerTitle>{data.user.name}</DrawerTitle>
							<DrawerDescription>{data.user.email}</DrawerDescription>
						</div>
					</DrawerHeader>
					<DrawerFooter>
						<Button asChild variant="outline" size="lg">
							<Link href="/user/profile">
								<UserPenIcon className="size-4" />
								{t('users.profile')}
							</Link>
						</Button>
						<Separator />
						<Button variant="destructive" size="lg" onClick={handleLogout}>
							<LogOutIcon />
							{t('auth.logout')}
						</Button>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex h-14 w-full items-center justify-between gap-2 overflow-hidden rounded-lg border bg-secondary p-2 transition-colors hover:bg-secondary/80">
				<UserAvatar name={data.user.name} />
				<div className="flex min-w-0 flex-1 flex-col gap-0.5 overflow-hidden text-left">
					<p className="w-full truncate text-secondary-foreground text-sm">
						{data.user.name}
					</p>
					<p className="w-full truncate text-muted-foreground text-xs">
						{data.user.email}
					</p>
				</div>
				<ChevronDownIcon className="size-4 shrink-0" />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" side="right" className="w-72">
				<DropdownMenuLabel className="flex w-full items-center justify-between">
					<div className="flex flex-col gap-1">
						<span className="truncate font-medium">{data.user.name}</span>
						<span className="truncate font-normal text-muted-foreground text-sm">
							{data.user.email}
						</span>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuItem
					asChild
					className="flex h-9 cursor-pointer items-center"
				>
					<Link href="/user/profile">
						<UserPenIcon className="size-4" />
						{t('users.profile')}
					</Link>
				</DropdownMenuItem>
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
