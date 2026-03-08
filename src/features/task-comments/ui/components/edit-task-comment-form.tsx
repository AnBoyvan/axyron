import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { TextareaField } from '@/components/form/textarea-field';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { MAX_COMMENT_SIZE } from '../../constants';
import { useUpdateTaskComment } from '../../hooks/use-update-task-comment';
import {
	type UpdateTaskCommentSchema,
	updateTaskCommentSchema,
} from '../../schemas/update-task-comment-schema';
import type { TaskComment } from '../../types';

interface EditTaskCommentFormProps {
	comment: TaskComment;
	onClose: () => void;
}

export const EditTaskCommentForm = ({
	comment,
	onClose,
}: EditTaskCommentFormProps) => {
	const t = useTranslations();

	const updateComment = useUpdateTaskComment();

	const form = useForm<UpdateTaskCommentSchema>({
		defaultValues: {
			commentId: comment.id,
			content: comment.content,
		},
		resolver: zodResolver(updateTaskCommentSchema),
	});

	const onSubmit = (values: UpdateTaskCommentSchema) => {
		updateComment.mutate(values, { onSuccess: () => onClose() });
	};
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-2"
			>
				<TextareaField
					name="content"
					control={form.control}
					disabled={updateComment.isPending}
					maxLenght={MAX_COMMENT_SIZE}
					placeholder={t('common.comment_placeholder')}
					className="min-h-0 resize-none overflow-hidden bg-transparent"
				/>
				<div className="flex justify-end gap-2">
					<Button type="button" size="sm" variant="ghost" onClick={onClose}>
						{t('actions.cancel')}
					</Button>
					<Button
						type="submit"
						size="sm"
						disabled={
							updateComment.isPending ||
							!form.formState.isDirty ||
							!form.formState.isValid
						}
					>
						{t('actions.save')}
					</Button>
				</div>
			</form>
		</Form>
	);
};
