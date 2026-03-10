import { MessageSquareTextIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { InfiniteScroll } from '@/components/shared/infinite-scroll';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { useTaskComments } from '@/features/task-comments/hooks/use-task-comments';
import { CreateTaskCommentForm } from '@/features/task-comments/ui/components/create-task-comment-form';
import { TaskCommentItem } from '@/features/task-comments/ui/components/task-comment-item';

interface TaskCommentsSectionProps {
	taskId: string;
}

export const TaskCommentsSection = ({ taskId }: TaskCommentsSectionProps) => {
	const t = useTranslations();

	const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
		useTaskComments({ taskId });

	return (
		<div className="flex flex-col gap-2 px-4 pb-4 lg:px-8 lg:pb-8">
			<div className="flex h-8 w-full items-center gap-2 text-muted-foreground">
				<MessageSquareTextIcon className="size-4" />
				<h2 className="font-semibold text-base">
					{t('common.comments')}
					{` (${data.pages[0].total})`}
				</h2>
			</div>
			<CreateTaskCommentForm taskId={taskId} />
			<div className="mt-2 flex flex-col gap-4">
				{data.pages
					.flatMap(page => page.items)
					.map(comment => (
						<TaskCommentItem key={comment.id} comment={comment} />
					))}
				<InfiniteScroll
					hasNextPage={hasNextPage}
					isFetchingNextPage={isFetchingNextPage}
					fetchNextPage={fetchNextPage}
					isManual
				/>
			</div>
		</div>
	);
};

export const TaskCommentsSectionSkeleton = () => {
	return (
		<div className="flex flex-col gap-2 px-4 pb-4 lg:px-8 lg:pb-8">
			<div className="flex h-8 items-center">
				<Skeleton className="h-4 w-24" />
			</div>
			<div className="flex h-10 w-full items-center justify-center">
				<Spinner className="size-8 text-muted-foreground" />
			</div>
		</div>
	);
};
