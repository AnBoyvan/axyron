// features/meeting-comments/ui/components/meeting-comment-item.tsx
import { useState } from 'react';

import { formatDistanceToNow } from 'date-fns';
import { useLocale, useTranslations } from 'next-intl';

import { EmojiPicker } from '@/components/shared/emoji-picker';
import { UserAvatar } from '@/features/users/ui/components/user-avatar';
import { fnsLocale } from '@/i18n/config';
import { authClient } from '@/lib/auth/auth-client';
import { cn } from '@/lib/utils/cn';

import { useMeetingCommentReactionToggle } from '../../hooks/use-meeting-comment-reaction-toggle';
import type { MeetingComment } from '../../types';
import { EditMeetingCommentForm } from './edit-meeting-comment-form';
import { MeetingCommentMenu } from './meeting-comment-menu';

interface MeetingCommentItemProps {
	comment: MeetingComment;
}

export const MeetingCommentItem = ({ comment }: MeetingCommentItemProps) => {
	const t = useTranslations();
	const locale = useLocale();
	const { data } = authClient.useSession();

	const [isEditing, setIsEditing] = useState(false);

	const canEdit = comment.userId === data?.user.id;
	const toggleReaction = useMeetingCommentReactionToggle(comment.meetingId);

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
					<MeetingCommentMenu
						comment={comment}
						canEdit={canEdit}
						onEdit={() => setIsEditing(true)}
					/>
				</div>
				{isEditing ? (
					<EditMeetingCommentForm
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
			</div>
		</div>
	);
};
