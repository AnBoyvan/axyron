import { cva, type VariantProps } from 'class-variance-authority';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils/cn';
import { getColorsByName } from '@/lib/utils/get-colors-by-name';

const avatarVariants = cva('', {
	variants: {
		size: {
			default: 'h-8 w-8',
			xs: 'h-4 w-4',
			sm: 'h-6 w-6',
			lg: 'h-10 w-10',
			xl: 'h-20 w-20',
		},
	},
	defaultVariants: {
		size: 'default',
	},
});

const avatarFallbackVariants = cva('', {
	variants: {
		size: {
			default: 'text-2xl',
			xs: 'text-[10px]',
			sm: 'text-base',
			lg: 'text-2xl',
			xl: 'text-6xl',
		},
	},
	defaultVariants: {
		size: 'default',
	},
});

interface UserAvatarProps extends VariantProps<typeof avatarVariants> {
	imageUrl?: string | null;
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
}: UserAvatarProps) => {
	const avatarFallback = name.charAt(0).toUpperCase();

	const { background, text } = getColorsByName(name);

	return (
		<Avatar
			className={cn(avatarVariants({ size, className }))}
			onClick={onClick}
		>
			<AvatarImage src={imageUrl ?? ''} alt={name} />
			<AvatarFallback
				style={{ color: text, backgroundColor: background }}
				className={cn(
					avatarFallbackVariants({ size }),
					'items-center justify-center bg-violet-500 font-medium text-accent uppercase',
				)}
			>
				{avatarFallback}
			</AvatarFallback>
		</Avatar>
	);
};
