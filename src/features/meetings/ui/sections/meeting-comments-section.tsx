import { MessageSquareTextIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { InfiniteScroll } from '@/components/shared/infinite-scroll';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { useMeetingComments } from '@/features/meeting-comments/hooks/use-meeting-comments';
import { CreateMeetingCommentForm } from '@/features/meeting-comments/ui/components/create-meeting-comment-form';
import { MeetingCommentItem } from '@/features/meeting-comments/ui/components/meeting-comment-item';

interface MeetingCommentsSectionProps {
	meetingId: string;
}

export const MeetingCommentsSection = ({
	meetingId,
}: MeetingCommentsSectionProps) => {
	const t = useTranslations();
	const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
		useMeetingComments({ meetingId });

	return (
		<div className="flex flex-col gap-2 px-4 pb-4 lg:px-6 lg:pb-6">
			<div className="flex h-13 items-center gap-2 border-b text-muted-foreground lg:-mx-6 lg:px-6">
				<MessageSquareTextIcon className="size-4" />
				<h2 className="font-semibold">
					{t('common.comments')} ({data.pages[0].total})
				</h2>
			</div>
			<div className="pt-2">
				<CreateMeetingCommentForm meetingId={meetingId} />
			</div>
			<div className="flex flex-col gap-4 pt-2">
				{data.pages
					.flatMap(page => page.items)
					.map(comment => (
						<MeetingCommentItem key={comment.id} comment={comment} />
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

export const MeetingCommentsSectionSkeleton = () => (
	<div className="flex flex-col gap-2 px-4 pb-4 lg:px-6 lg:pb-6">
		<div className="flex h-13 items-center border-b">
			<Skeleton className="h-4 w-28" />
		</div>
		<div className="flex h-10 w-full items-center justify-center">
			<Spinner className="size-8 text-muted-foreground" />
		</div>
	</div>
);
