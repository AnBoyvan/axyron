import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { InputField } from '@/components/form/input-field';
import { TextareaField } from '@/components/form/textarea-field';
import { ResponsiveDialog } from '@/components/shared/responsive-dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { useCreateOrg } from '../../hooks/use-create-org';
import { useCreateOrgDialog } from '../../hooks/use-create-org-dialog';
import {
	type CreateOrgSchema,
	createOrgSchema,
} from '../../schemas/create-org-schema';

export const CreateOrgDialog = () => {
	const t = useTranslations();
	const { isOpen, onClose } = useCreateOrgDialog();

	const form = useForm<CreateOrgSchema>({
		resolver: zodResolver(createOrgSchema),
		defaultValues: {
			name: '',
			description: '',
		},
	});

	const createOrg = useCreateOrg();

	const onSubmit = (values: CreateOrgSchema) => {
		createOrg.mutate(values, {
			onSuccess: () => {
				form.reset();
				onClose();
			},
		});
	};

	return (
		<ResponsiveDialog
			title={t('orgs.new_org')}
			description={t('orgs.new_org_descr')}
			open={isOpen}
			onOpenChange={onClose}
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<InputField
						control={form.control}
						name="name"
						label={t('common.name')}
						placeholder={t('orgs.name_placeholder')}
					/>
					<TextareaField
						control={form.control}
						name="description"
						label={t('common.description')}
						placeholder={t('orgs.descr_placeholder')}
					/>
					<div className="flex justify-between gap-x-2">
						<Button
							type="button"
							disabled={createOrg.isPending}
							variant="ghost"
							onClick={() => {
								onClose();
								form.reset();
							}}
						>
							{t('actions.cancel')}
						</Button>
						<Button type="submit" disabled={createOrg.isPending}>
							{t('actions.create')}
						</Button>
					</div>
				</form>
			</Form>
		</ResponsiveDialog>
	);
};
