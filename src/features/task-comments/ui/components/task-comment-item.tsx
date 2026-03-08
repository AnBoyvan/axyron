import { useState } from 'react';

import { formatDistanceToNow } from 'date-fns';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { EmojiPicker } from '@/components/shared/emoji-picker';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/features/users/ui/components/user-avatar';
import { fnsLocale } from '@/i18n/config';
import { authClient } from '@/lib/auth/auth-client';
import { cn } from '@/lib/utils/cn';

import { useTaskCommentReactionToggle } from '../../hooks/use-task-comment-reaction-toggle';
import type { TaskComment } from '../../types';
import { CreateTaskCommentForm } from './create-task-comment-form';
import { EditTaskCommentForm } from './edit-task-comment-form';
import { TaskCommentMenu } from './task-comment-menu';
import { TaskCommentReplies } from './task-comments-replies';

interface TaskCommentItemProps {
	comment: TaskComment;
	variant?: 'comment' | 'reply';
}

export const TaskCommentItem = ({
	comment,
	variant = 'comment',
}: TaskCommentItemProps) => {
	const t = useTranslations();
	const locale = useLocale();
	const { data } = authClient.useSession();

	const [isEditing, setIsEditing] = useState(false);
	const [isReplying, setIsReplying] = useState(false);
	const [showReplies, setShowReplies] = useState(false);

	const toggleReaction = useTaskCommentReactionToggle({
		taskId: comment.taskId,
		parentId: comment.parentId,
	});

	const canEdit = comment.userId === data?.user.id;
	const hasReplies = comment.replyCount > 0;

	return (
		<div className="flex gap-3">
			<UserAvatar imageUrl={comment.author.image} name={comment.author.name} />
			<div className="flex w-full flex-col gap-1">
				<div className="flex items-center gap-1">
					<span className="line-clamp-1 font-medium text-sm leading-none">
						{comment.author.name}
					</span>
					<span className="ml-auto text-nowrap text-muted-foreground text-xs">
						{formatDistanceToNow(comment.createdAt, {
							addSuffix: true,
							locale: fnsLocale[locale],
						})}
					</span>
					{comment.edited && (
						<span className="text-muted-foreground text-xs italic">
							{`(${t('common.edited')})`}
						</span>
					)}
					<TaskCommentMenu
						comment={comment}
						variant={variant}
						canEdit={canEdit}
						onReplyOpen={() => setIsReplying(true)}
						onEdit={() => setIsEditing(true)}
					/>
				</div>
				{isEditing ? (
					<EditTaskCommentForm
						comment={comment}
						onClose={() => setIsEditing(false)}
					/>
				) : (
					<p className="whitespace-pre-wrap break-words text-sm">
						{comment.content}
					</p>
				)}
				{!isEditing && (
					<div className="flex flex-wrap items-center gap-1">
						{variant === 'comment' && hasReplies && (
							<Button
								size="xs"
								variant="ghost"
								className="text-primary"
								onClick={() => setShowReplies(v => !v)}
							>
								{showReplies ? (
									<ChevronUpIcon className="size-3.5" />
								) : (
									<ChevronDownIcon className="size-3.5" />
								)}
								{`${t('common.replies')}: ${comment.replyCount}`}
							</Button>
						)}
						{comment.reactions.map(reaction => (
							<button
								key={reaction.emoji}
								disabled={toggleReaction.isPending}
								onClick={() =>
									toggleReaction.mutate({
										commentId: comment.id,
										emoji: reaction.emoji,
									})
								}
								className={cn(
									'flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors',
									reaction.userReacted
										? 'border-primary/40 bg-primary/10 text-primary'
										: 'border-border bg-muted hover:bg-accent',
								)}
							>
								<span>{reaction.emoji}</span>
								<span>{reaction.count}</span>
							</button>
						))}

						<EmojiPicker
							disabled={toggleReaction.isPending}
							onSelect={emoji =>
								toggleReaction.mutate({ commentId: comment.id, emoji })
							}
						/>
					</div>
				)}
				{isReplying && (
					<div className="mt-2">
						<CreateTaskCommentForm
							taskId={comment.taskId}
							parentId={comment.id}
							variant="reply"
							onSuccess={() => {
								setIsReplying(false);
								setShowReplies(true);
							}}
							onCancel={() => setIsReplying(false)}
						/>
					</div>
				)}
				{variant === 'comment' && showReplies && (
					<TaskCommentReplies taskId={comment.taskId} parentId={comment.id} />
				)}
			</div>
		</div>
	);
};
