import { cn } from '@/lib/utils/cn';

interface DateHeaderProps {
	date: Date;
	label: string;
	isOffRange?: boolean;
}

export const DateHeader = ({ date, label, isOffRange }: DateHeaderProps) => {
	const today = new Date();
	const isToday =
		date.getDate() === today.getDate() &&
		date.getMonth() === today.getMonth() &&
		date.getFullYear() === today.getFullYear();

	return (
		<div className="flex justify-end p-1">
			<span
				className={cn(
					'flex size-6 items-center justify-center rounded-full text-xs',
					isToday && 'bg-primary font-medium text-primary-foreground',
					!isToday && isOffRange && 'text-muted-foreground/50',
					!isToday && !isOffRange && 'text-foreground',
				)}
			>
				{label}
			</span>
		</div>
	);
};
