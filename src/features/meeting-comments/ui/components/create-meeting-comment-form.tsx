import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { TextareaField } from '@/components/form/textarea-field';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { UserAvatar } from '@/features/users/ui/components/user-avatar';
import { authClient } from '@/lib/auth/auth-client';

import { MAX_MEETING_COMMENT_SIZE } from '../../constants';
import { useCreateMeetingComment } from '../../hooks/use-create-meeting-comment';
import {
	type CreateMeetingCommentSchema,
	createMeetingCommentSchema,
} from '../../schemas/create-meeting-comment-schema';

interface CreateMeetingCommentFormProps {
	meetingId: string;
	onSuccess?: () => void;
}

export const CreateMeetingCommentForm = ({
	meetingId,
	onSuccess,
}: CreateMeetingCommentFormProps) => {
	const t = useTranslations();
	const { data } = authClient.useSession();

	const createComment = useCreateMeetingComment();

	const form = useForm<CreateMeetingCommentSchema>({
		defaultValues: { meetingId, content: '' },
		resolver: zodResolver(createMeetingCommentSchema),
	});

	const onSubmit = (values: CreateMeetingCommentSchema) => {
		createComment.mutate(values, {
			onSuccess: () => {
				form.reset({ meetingId, content: '' });
				onSuccess?.();
			},
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4">
				<UserAvatar
					size="lg"
					imageUrl={data?.user.image}
					name={data?.user.name ?? 'User'}
				/>
				<div className="flex-1">
					<TextareaField
						name="content"
						control={form.control}
						disabled={createComment.isPending}
						maxLenght={MAX_MEETING_COMMENT_SIZE}
						placeholder={t('common.comment_placeholder')}
						className="min-h-0 resize-none overflow-hidden bg-transparent"
					/>
					<div className="mt-2 flex justify-end">
						<Button
							type="submit"
							size="sm"
							disabled={
								createComment.isPending ||
								!form.formState.isDirty ||
								!form.formState.isValid
							}
						>
							{t('actions.comment')}
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
};
