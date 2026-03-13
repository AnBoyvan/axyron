import { useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlusIcon, XIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { BooleanSelectField } from '@/components/form/boolean-select-field';
import { DateField } from '@/components/form/date-field';
import { InputField } from '@/components/form/input-field';
import { MembersField } from '@/components/form/members-field';
import { SelectField } from '@/components/form/select-field';
import { TextareaField } from '@/components/form/textarea-field';
import { ResponsiveDialog } from '@/components/shared/responsive-dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { SelectItem } from '@/components/ui/select';
import { useProjectMembersForTask } from '@/features/projects/hooks/use-project-members-for-task';
import { UserAvatar } from '@/features/users/ui/components/user-avatar';
import { cn } from '@/lib/utils/cn';

import { taskPriorityOptions } from '../../configs/task-priority-options';
import { useCreateTask } from '../../hooks/use-create-task';
import {
	type CreateTaskSchema,
	createTaskSchema,
} from '../../schemas/create-task-schema';

interface NewTaskDialogProps {
	projectId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const NewTaskDialog = ({
	projectId,
	open,
	onOpenChange,
}: NewTaskDialogProps) => {
	const t = useTranslations();

	const form = useForm<CreateTaskSchema>({
		resolver: zodResolver(createTaskSchema),
		defaultValues: {
			title: '',
			description: '',
			needReview: false,
			priority: 'low',
			startDate: undefined,
			dueDate: undefined,
			assigneeIds: [],
		},
	});

	const { data, isLoading } = useProjectMembersForTask(projectId);

	const createTask = useCreateTask();

	const onCancel = () => {
		onOpenChange(false);
		form.reset();
	};

	const onSubmit = (values: CreateTaskSchema) => {
		createTask.mutate(
			{
				projectId,
				data: values,
			},
			{
				onSuccess: () => {
					onCancel();
				},
			},
		);
	};

	const addedMembers = useMemo(() => {
		if (!data) {
			return [];
		}

		return data.filter(item =>
			form.watch('assigneeIds')?.includes(item.userId),
		);
	}, [data, form.watch('assigneeIds')]);

	const users = useMemo(() => {
		if (!data) {
			return [];
		}

		return data.map(item => ({
			userId: item.userId,
			name: item.name,
			image: item.image,
			email: item.email,
		}));
	}, [data]);

	return (
		<ResponsiveDialog
			title={t('tasks.new_title')}
			description={t('tasks.new_description')}
			open={open}
			onOpenChange={onCancel}
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<InputField
						control={form.control}
						name="title"
						disabled={createTask.isPending}
						label={t('tasks.title_title')}
						placeholder={t('tasks.title_placeholder')}
					/>
					<TextareaField
						control={form.control}
						name="description"
						disabled={createTask.isPending}
						label={t('common.description')}
						placeholder={t('tasks.description_placeholder')}
					/>
					<div className="grid grid-cols-2 gap-4">
						<SelectField
							control={form.control}
							name="priority"
							disabled={createTask.isPending}
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
							disabled={createTask.isPending}
							label={t('tasks.need_review')}
							className="w-full"
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<DateField
							control={form.control}
							disabled={createTask.isPending}
							name="startDate"
							label={t('common.start_date')}
							placeholder={t('common.not_set')}
						/>
						<DateField
							control={form.control}
							disabled={createTask.isPending}
							name="dueDate"
							label={t('common.due_date')}
							placeholder={t('common.not_set')}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<Label>{t('common.assignees')}</Label>
						<MembersField
							control={form.control}
							name="assigneeIds"
							label={t('common.assignees')}
							users={users}
							isLoading={isLoading}
							disabled={createTask.isPending}
						>
							<Button size="sm" variant="select" className="w-fit">
								<UserPlusIcon />
								{t('actions.assign')}
							</Button>
						</MembersField>
						{addedMembers.map(member => (
							<div
								key={member.userId}
								className="flex w-full items-center gap-2"
							>
								<UserAvatar imageUrl={member.image} name={member.name} />
								<span className="truncate text-sm">{member.name}</span>
								<Button
									variant="ghost"
									size="icon-xs"
									onClick={() =>
										form.setValue(
											'assigneeIds',
											form
												.watch('assigneeIds')
												?.filter(item => item !== member.userId),
										)
									}
								>
									<XIcon className="text-destructive" />
								</Button>
							</div>
						))}
					</div>
					<div className="flex justify-between gap-x-2">
						<Button
							type="button"
							disabled={createTask.isPending}
							variant="ghost"
							onClick={onCancel}
						>
							{t('actions.cancel')}
						</Button>
						<Button type="submit" disabled={createTask.isPending}>
							{t('actions.create')}
						</Button>
					</div>
				</form>
			</Form>
		</ResponsiveDialog>
	);
};
