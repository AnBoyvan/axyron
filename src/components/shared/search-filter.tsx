import { SearchIcon } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils/cn';

import { Skeleton } from '../ui/skeleton';

interface SearchFilterProps {
	value: string;
	onChange: (value: string) => void;
	className?: string;
	iconClassName?: string;
	placeholder?: string;
}

export const SearchFilter = ({
	value,
	onChange,
	className,
	iconClassName,
	placeholder,
}: SearchFilterProps) => {
	return (
		<div className="relative">
			<SearchIcon
				className={cn(
					'absolute top-1/2 left-2 size-4 -translate-y-1/2',
					iconClassName,
				)}
			/>
			<Input
				type="search"
				value={value}
				onChange={e => onChange(e.target.value)}
				placeholder={placeholder}
				className={cn(
					'h-9 w-[200px] bg-background pl-7 md:w-64 dark:bg-input/30',
					className,
				)}
			/>
		</div>
	);
};

export const SearchFilterSkeleton = () => {
	return <Skeleton className="h-9 w-[200px] md:w-64" />;
};
