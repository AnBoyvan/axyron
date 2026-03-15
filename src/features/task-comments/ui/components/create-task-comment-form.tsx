import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { TextareaField } from '@/components/form/textarea-field';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { UserAvatar } from '@/features/users/ui/components/user-avatar';
import { authClient } from '@/lib/auth/auth-client';

import { MAX_TASK_COMMENT_SIZE } from '../../constants';
import { useCreateTaskComment } from '../../hooks/use-create-task-comment';
import {
	type CreateTaskCommentSchema,
	createTaskCommentSchema,
} from '../../schemas/create-task-comment-schema';

interface CreateTaskCommentFormProps {
	taskId: string;
	parentId?: string;
	onSuccess?: () => void;
	onCancel?: () => void;
	variant?: 'comment' | 'reply';
}

export const CreateTaskCommentForm = ({
	taskId,
	parentId,
	onSuccess,
	onCancel,
	variant = 'comment',
}: CreateTaskCommentFormProps) => {
	const t = useTranslations();
	const { data } = authClient.useSession();

	const createComment = useCreateTaskComment();

	const form = useForm<CreateTaskCommentSchema>({
		defaultValues: {
			parentId,
			taskId,
			content: '',
		},
		resolver: zodResolver(createTaskCommentSchema),
	});

	const onSubmit = (values: CreateTaskCommentSchema) => {
		createComment.mutate(values, {
			onSuccess: () => {
				form.reset();
				onSuccess?.();
			},
		});
	};

	const handleCancel = () => {
		form.reset();
		onCancel?.();
	};
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="group flex gap-4">
				<UserAvatar
					size="lg"
					imageUrl={data?.user.image}
					name={data?.user.name || 'User'}
				/>
				<div className="flex-1">
					<TextareaField
						name="content"
						control={form.control}
						disabled={createComment.isPending}
						maxLenght={MAX_TASK_COMMENT_SIZE}
						placeholder={t(
							variant === 'reply'
								? 'common.reply_placeholder'
								: 'common.comment_placeholder',
						)}
						className="min-h-0 resize-none overflow-hidden bg-transparent"
					/>
					<div className="mt-2 flex justify-end gap-2">
						{onCancel && (
							<Button
								type="button"
								size="sm"
								variant="ghost"
								onClick={handleCancel}
							>
								{t('actions.cancel')}
							</Button>
						)}
						<Button
							type="submit"
							size="sm"
							disabled={
								createComment.isPending ||
								!form.formState.isDirty ||
								!form.formState.isValid
							}
						>
							{t(variant === 'reply' ? 'actions.reply' : 'actions.comment')}
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
};
