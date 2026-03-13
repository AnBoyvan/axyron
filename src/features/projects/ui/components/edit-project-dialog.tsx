import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { InputField } from '@/components/form/input-field';
import { SelectField } from '@/components/form/select-field';
import { TextareaField } from '@/components/form/textarea-field';
import { ResponsiveDialog } from '@/components/shared/responsive-dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { SelectItem } from '@/components/ui/select';

import { projectStatuses } from '../../configs/project-status-options';
import { useUpdateProject } from '../../hooks/use-update-project';
import {
	type UpdateProjectSchema,
	updateProjectSchema,
} from '../../schemas/update-project-schema';
import type { ProjectById } from '../../types';
import { VisibilitySelect } from './visibility-select';

interface EditProjectDialogProps {
	project: ProjectById;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const EditProjectDialog = ({
	project,
	open,
	onOpenChange,
}: EditProjectDialogProps) => {
	const t = useTranslations();

	const form = useForm<UpdateProjectSchema>({
		resolver: zodResolver(updateProjectSchema),
		defaultValues: {
			name: project.name,
			description: project.description,
			visibility: project.visibility,
			status: project.status,
		},
	});

	const updateProject = useUpdateProject();

	const onSubmit = (values: UpdateProjectSchema) => {
		updateProject.mutate(
			{
				id: project.id,
				data: values,
			},
			{
				onSuccess: () => {
					onOpenChange(false);
				},
			},
		);
	};

	return (
		<ResponsiveDialog
			title={t('projects.edit_title')}
			description={t('projects.edit_description')}
			open={open}
			onOpenChange={onOpenChange}
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<InputField
						control={form.control}
						name="name"
						disabled={updateProject.isPending}
						label={t('common.name')}
						placeholder={t('projects.name_placeholder')}
					/>
					<VisibilitySelect
						control={form.control}
						name="visibility"
						label={t('projects.visibility')}
						disabled={updateProject.isPending}
					/>
					<SelectField
						control={form.control}
						name="status"
						label={t('common.status')}
						disabled={updateProject.isPending}
						className="w-1/2"
					>
						{projectStatuses.map(option => (
							<SelectItem key={option.value} value={option.value}>
								<div className="flex items-center gap-2">
									<option.icon className={option.style} />
									{t(option.label)}
								</div>
							</SelectItem>
						))}
					</SelectField>
					<TextareaField
						control={form.control}
						name="description"
						disabled={updateProject.isPending}
						label={t('common.description')}
						placeholder={t('projects.description_placeholder')}
					/>
					<div className="flex justify-between gap-x-2">
						<Button
							type="button"
							disabled={updateProject.isPending}
							variant="ghost"
							onClick={() => onOpenChange(false)}
						>
							{t('actions.cancel')}
						</Button>
						<Button type="submit" disabled={updateProject.isPending}>
							{t('actions.save')}
						</Button>
					</div>
				</form>
			</Form>
		</ResponsiveDialog>
	);
};
