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
			sm: 'h-6 w-6',
			lg: 'h-10 w-10',
			xl: 'h-12 w-12',
		},
		form: {
			default: 'rounded-full',
			square: 'rounded-md',
		},
	},
	defaultVariants: {
		size: 'default',
		form: 'default',
	},
});

const avatarFallbackVariants = cva('', {
	variants: {
		size: {
			default: 'text-lg',
			// xs: 'text-[10px]',
			sm: 'text-base',
			lg: 'text-2xl',
			xl: 'text-4xl',
		},
		form: {
			default: 'rounded-full',
			square: 'rounded-md',
		},
	},
	defaultVariants: {
		size: 'default',
		form: 'default',
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
	form,
	isAdmin,
}: UserAvatarProps) => {
	const avatarFallback = name.charAt(0).toUpperCase();

	const { background, text } = getColorsByName(name);

	return (
		<Avatar
			className={cn(
				avatarVariants({ size, className, form }),
				'overflow-visible',
			)}
			onClick={onClick}
		>
			<AvatarImage
				src={imageUrl ?? ''}
				alt={name}
				className={cn(avatarVariants({ form, size }))}
			/>
			<AvatarFallback
				style={{ color: text, backgroundColor: background }}
				className={cn(
					avatarFallbackVariants({ size, form }),
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
