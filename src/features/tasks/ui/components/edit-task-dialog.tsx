import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { BooleanSelectField } from '@/components/form/boolean-select-field';
import { DateField } from '@/components/form/date-field';
import { InputField } from '@/components/form/input-field';
import { SelectField } from '@/components/form/select-field';
import { TextareaField } from '@/components/form/textarea-field';
import { ResponsiveDialog } from '@/components/shared/responsive-dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { SelectItem } from '@/components/ui/select';
import { cn } from '@/lib/utils/cn';

import { taskPriorityOptions } from '../../configs/task-priority-options';
import { useUpdateTask } from '../../hooks/use-update-task';
import {
	type UpdateTaskSchema,
	updateTaskSchema,
} from '../../schemas/update-task-schema';
import type { Task } from '../../types';

interface EditTaskDialogProps {
	task: Task;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const EditTaskDialog = ({
	task,

	open,
	onOpenChange,
}: EditTaskDialogProps) => {
	const t = useTranslations();

	const form = useForm<UpdateTaskSchema>({
		resolver: zodResolver(updateTaskSchema),
		defaultValues: {
			title: task.title,
			description: task.description ?? '',
			needReview: task.needReview,
			priority: task.priority,
			startDate: task.startDate,
			dueDate: task.dueDate,
		},
	});

	const updateTask = useUpdateTask();

	const onCancel = () => {
		onOpenChange(false);
	};

	const onSubmit = (values: UpdateTaskSchema) => {
		updateTask.mutate(
			{
				taskId: task.id,
				data: values,
			},
			{
				onSuccess: () => {
					onCancel();
				},
			},
		);
	};

	return (
		<ResponsiveDialog
			title={t('tasks.edit_title')}
			description={t('tasks.edit_description')}
			open={open}
			onOpenChange={onCancel}
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<InputField
						control={form.control}
						name="title"
						disabled={updateTask.isPending}
						label={t('tasks.title_title')}
						placeholder={t('tasks.title_placeholder')}
					/>
					<TextareaField
						control={form.control}
						name="description"
						disabled={updateTask.isPending}
						label={t('common.description')}
						placeholder={t('tasks.description_placeholder')}
					/>
					<div className="grid grid-cols-2 gap-4">
						<SelectField
							control={form.control}
							name="priority"
							disabled={updateTask.isPending}
							label={t('tasks.priority_title')}
							className="w-full"
						>
							{taskPriorityOptions.map(option => (
								<SelectItem key={option.value} value={option.value}>
									<div className="flex items-center gap-2">
										<div
											className={cn(
												'size-4 shrink-0 rounded-full',
												option.cirkle,
											)}
										/>
										{t(option.label)}
									</div>
								</SelectItem>
							))}
						</SelectField>
						<BooleanSelectField
							control={form.control}
							name="needReview"
							disabled={
								updateTask.isPending ||
								(!task.permissions.isOrgAdmin &&
									!task.permissions.isProjectAdmin)
							}
							label={t('tasks.need_review')}
							className="w-full"
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<DateField
							control={form.control}
							disabled={updateTask.isPending}
							name="startDate"
							label={t('common.start_date')}
							placeholder={t('common.not_set')}
						/>
						<DateField
							control={form.control}
							disabled={updateTask.isPending}
							name="dueDate"
							label={t('common.due_date')}
							placeholder={t('common.not_set')}
						/>
					</div>

					<div className="flex justify-between gap-x-2">
						<Button
							type="button"
							disabled={updateTask.isPending}
							variant="ghost"
							onClick={onCancel}
						>
							{t('actions.cancel')}
						</Button>
						<Button type="submit" disabled={updateTask.isPending}>
							{t('actions.save')}
						</Button>
					</div>
				</form>
			</Form>
		</ResponsiveDialog>
	);
};
