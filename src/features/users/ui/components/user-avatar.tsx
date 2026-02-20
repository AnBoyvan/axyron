import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronsUpIcon } from 'lucide-react';

import {
	Avatar,
	AvatarBadge,
	AvatarFallback,
	AvatarImage,
} from '@/components/ui/avatar';
import { cn } from '@/lib/utils/cn';
import { getColorsByName } from '@/lib/utils/get-colors-by-name';

const avatarVariants = cva('', {
	variants: {
		size: {
			default: 'h-8 w-8',
			// xs: 'h-4 w-4',
			// sm: 'h-6 w-6',
			// lg: 'h-10 w-10',
			// xl: 'h-20 w-20',
		},
	},
	defaultVariants: {
		size: 'default',
	},
});

const avatarFallbackVariants = cva('', {
	variants: {
		size: {
			default: 'text-lg',
			// xs: 'text-[10px]',
			// sm: 'text-base',
			// lg: 'text-2xl',
			// xl: 'text-6xl',
		},
	},
	defaultVariants: {
		size: 'default',
	},
});

interface UserAvatarProps extends VariantProps<typeof avatarVariants> {
	imageUrl?: string | null;
	isAdmin?: boolean;
	name: string;
	className?: string;
	onClick?: () => void;
}

export const UserAvatar = ({
	imageUrl,
	name,
	className,
	onClick,
	size,
	isAdmin,
}: UserAvatarProps) => {
	const avatarFallback = name.charAt(0).toUpperCase();

	const { background, text } = getColorsByName(name);

	return (
		<Avatar
			className={cn(avatarVariants({ size, className }), 'overflow-visible')}
			onClick={onClick}
		>
			<AvatarImage
				src={imageUrl ?? ''}
				alt={name}
				className={cn('rounded-full')} // TODO: profile image not round
			/>
			<AvatarFallback
				style={{ color: text, backgroundColor: background }}
				className={cn(
					avatarFallbackVariants({ size }),
					'items-center justify-center font-medium uppercase',
				)}
			>
				{avatarFallback}
			</AvatarFallback>
			{isAdmin && (
				<AvatarBadge className="bg-muted">
					<ChevronsUpIcon className="size-3! shrink-0 text-primary" />
				</AvatarBadge>
			)}
		</Avatar>
	);
};
