import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ChevronDownIcon, LogOutIcon, UserPenIcon } from 'lucide-react';
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
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { authClient } from '@/lib/auth/auth-client';

import { userNav } from '../../configs/user-nav';
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
			<div className="flex h-12 w-full items-center justify-between gap-2 overflow-hidden px-2">
				<Skeleton className="size-8 rounded-full" />
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
				<DrawerTrigger className="flex w-full items-center justify-between gap-2 overflow-hidden rounded-lg border bg-secondary p-2 text-sidebar-foreground transition-colors hover:bg-sidebar-accent data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground data-hover:text-sidebar-accent-foreground">
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
						{userNav.map(item => (
							<Button key={item.label} asChild variant="outline" size="lg">
								<Link href={item.link}>
									<item.icon className="size-4" />
									{t(item.label)}
								</Link>
							</Button>
						))}
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
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
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
						</SidebarMenuButton>
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
								<Link href={item.link}>
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
			</SidebarMenuItem>
		</SidebarMenu>
	);
};
