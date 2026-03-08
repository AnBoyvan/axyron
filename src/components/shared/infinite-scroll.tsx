import { useEffect } from 'react';

import { useTranslations } from 'next-intl';

import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

import { Button } from '../ui/button';

interface InfiniteScrollProps {
	isManual?: boolean;
	hasNextPage: boolean;
	isFetchingNextPage: boolean;
	fetchNextPage: () => void;
}

export const InfiniteScroll = ({
	isManual = false,
	hasNextPage,
	isFetchingNextPage,
	fetchNextPage,
}: InfiniteScrollProps) => {
	const t = useTranslations();
	const { targetRef, isIntersecting } = useIntersectionObserver({
		threshold: 0.5,
		rootMargin: '100px',
	});

	useEffect(() => {
		if (!isManual && isIntersecting && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [
		isManual,
		hasNextPage,
		isFetchingNextPage,
		isIntersecting,
		fetchNextPage,
	]);

	return (
		<div className="flex flex-col items-center gap-4 p-4">
			<div ref={targetRef} className="h-1" />
			{hasNextPage && (
				<Button
					variant="secondary"
					disabled={isFetchingNextPage || !hasNextPage}
					onClick={() => fetchNextPage()}
				>
					{isFetchingNextPage
						? `${t('common.loading')}...`
						: t('actions.load_more')}
				</Button>
			)}
		</div>
	);
};
