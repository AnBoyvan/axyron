import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

interface ViewWrapperProps {
	children: ReactNode;
	className?: string;
}

export const ViewWrapper = ({ children, className }: ViewWrapperProps) => {
	return (
		<div className={cn('"flex flex-1 flex-col p-4 lg:p-8', className)}>
			{children}
		</div>
	);
};
