import { ActivityIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { InfiniteScroll } from '@/components/shared/infinite-scroll';
import { Skeleton } from '@/components/ui/skeleton';
import { useTaskActivities } from '@/features/activities/hooks/use-task-activities';
import { TaskActivityItem } from '@/features/activities/ui/components/task-activity-item';

interface TaskActivitySectionProps {
	taskId: string;
}

export const TaskActivitySection = ({ taskId }: TaskActivitySectionProps) => {
	const t = useTranslations();

	const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
		useTaskActivities(taskId);

	const items = data.pages.flatMap(page => page.items);

	return (
		<div className="flex flex-col">
			<div className="hidden h-13 items-center justify-center gap-2 border-b text-muted-foreground lg:flex">
				<ActivityIcon className="size-4" />
				<h2 className="font-semibold">{t('common.activity')}</h2>
			</div>
			<div className="flex flex-1 flex-col px-4 py-4">
				{items.length === 0 ? (
					<p className="mt-2 text-muted-foreground text-sm italic">
						{t('activities.empty')}
					</p>
				) : (
					<div className="flex flex-col gap-2">
						{items.map(activity => (
							<TaskActivityItem key={activity.id} activity={activity} />
						))}
						<InfiniteScroll
							hasNextPage={hasNextPage}
							isFetchingNextPage={isFetchingNextPage}
							fetchNextPage={fetchNextPage}
							isManual
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export const TaskActivitySectionSkeleton = () => {
	return (
		<div className="flex flex-col">
			<div className="flex h-13 items-center justify-center gap-2 border-b text-muted-foreground">
				<Skeleton className="h-4 w-20" />
			</div>
			<div className="flex flex-1 flex-col gap-2 px-4 py-4">
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={i} className="flex gap-3">
						<Skeleton className="size-7 shrink-0 rounded-full" />
						<div className="flex flex-col gap-1.5">
							<Skeleton className="h-3.5 w-48" />
							<Skeleton className="h-3 w-20" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
