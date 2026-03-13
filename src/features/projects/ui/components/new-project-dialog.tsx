import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { InputField } from '@/components/form/input-field';
import { TextareaField } from '@/components/form/textarea-field';
import { ResponsiveDialog } from '@/components/shared/responsive-dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { useCreateProject } from '../../hooks/use-create-project';
import {
	type CreateProjectSchema,
	createProjectSchema,
} from '../../schemas/create-project-schema';
import { VisibilitySelect } from './visibility-select';

interface NewProjectDialogProps {
	orgId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const NewProjectDialog = ({
	orgId,
	open,
	onOpenChange,
}: NewProjectDialogProps) => {
	const t = useTranslations();

	const form = useForm<CreateProjectSchema>({
		resolver: zodResolver(createProjectSchema),
		defaultValues: {
			name: '',
			description: '',
			visibility: 'public',
		},
	});

	const createProject = useCreateProject();

	const onSubmit = (values: CreateProjectSchema) => {
		createProject.mutate(
			{
				organizationId: orgId,
				data: values,
			},
			{
				onSuccess: () => {
					onOpenChange(false);
					form.reset();
				},
			},
		);
	};

	return (
		<ResponsiveDialog
			title={t('projects.new_title')}
			description={t('projects.new_description')}
			open={open}
			onOpenChange={onOpenChange}
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<InputField
						control={form.control}
						name="name"
						disabled={createProject.isPending}
						label={t('common.name')}
						placeholder={t('projects.name_placeholder')}
					/>
					<VisibilitySelect
						control={form.control}
						name="visibility"
						label={t('projects.visibility')}
						disabled={createProject.isPending}
					/>
					<TextareaField
						control={form.control}
						name="description"
						disabled={createProject.isPending}
						label={t('common.description')}
						placeholder={t('projects.description_placeholder')}
					/>
					<div className="flex justify-between gap-x-2">
						<Button
							type="button"
							disabled={createProject.isPending}
							variant="ghost"
							onClick={() => onOpenChange(false)}
						>
							{t('actions.cancel')}
						</Button>
						<Button type="submit" disabled={createProject.isPending}>
							{t('actions.create')}
						</Button>
					</div>
				</form>
			</Form>
		</ResponsiveDialog>
	);
};
