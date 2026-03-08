import { CornerDownRightIcon, Loader2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

import { useTaskCommentsReplies } from '../../hooks/use-task-comment-replies';
import { TaskCommentItem } from './task-comment-item';

interface TaskCommentRepliesProps {
	taskId: string;
	parentId: string;
}

export const TaskCommentReplies = ({
	taskId,
	parentId,
}: TaskCommentRepliesProps) => {
	const t = useTranslations();

	const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
		useTaskCommentsReplies({ taskId, parentId });

	return (
		<div className="">
			<div className="mt-2 flex flex-col gap-4">
				{isLoading && (
					<div className="flex items-center justify-center">
						<Loader2Icon className="size-6 animate-spin text-muted-foreground" />
					</div>
				)}
				{!isLoading &&
					data?.pages
						.flatMap(page => page.items)
						.map(comment => (
							<TaskCommentItem
								key={comment.id}
								comment={comment}
								variant="reply"
							/>
						))}
				{hasNextPage && (
					<Button
						size="sm"
						variant="secondary"
						disabled={isFetchingNextPage}
						onClick={() => fetchNextPage()}
					>
						<CornerDownRightIcon />
						{t('actions.show_more_replies')}
					</Button>
				)}
			</div>
		</div>
	);
};
