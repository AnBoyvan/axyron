import { cva, type VariantProps } from 'class-variance-authority';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils/cn';

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
			default: 'text-2xl rounded-xl',
			xs: 'text-[10px] rounded',
			sm: 'text-base rounded-lg',
			lg: 'text-2xl rounded-xl',
			xl: 'text-6xl rounded-2xl',
		},
	},
	defaultVariants: {
		size: 'default',
	},
});

interface OrgAvatarProps extends VariantProps<typeof avatarVariants> {
	imageUrl?: string | null;
	name: string;
	className?: string;
	onClick?: () => void;
}

export const OrgAvatar = ({
	imageUrl,
	name,
	className,
	onClick,
	size,
}: OrgAvatarProps) => {
	const avatarFallback = name.charAt(0).toUpperCase();

	return (
		<Avatar
			className={cn(avatarVariants({ size, className }), 'rounded-md')}
			onClick={onClick}
		>
			<AvatarImage src={imageUrl ?? ''} alt={name} className="rounded-md" />
			<AvatarFallback
				className={cn(
					avatarFallbackVariants({ size }),
					'items-center justify-center bg-accent-foreground font-medium text-accent uppercase',
				)}
			>
				{avatarFallback}
			</AvatarFallback>
		</Avatar>
	);
};
