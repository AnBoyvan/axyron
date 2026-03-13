import { zodResolver } from '@hookform/resolvers/zod';
import { SaveIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { InputField } from '@/components/form/input-field';
import { TextareaField } from '@/components/form/textarea-field';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';

import { useUpdateOrg } from '../../hooks/use-update-org';
import {
	type UpdateOrgSchema,
	updateOrgSchema,
} from '../../schemas/update-org-schema';
import type { Organization } from '../../types';

interface OrgEditFormProps {
	org: Organization;
}

export const OrgEditForm = ({ org }: OrgEditFormProps) => {
	const t = useTranslations();

	const form = useForm<UpdateOrgSchema>({
		resolver: zodResolver(updateOrgSchema),
		defaultValues: {
			name: org.name,
			description: org.description ?? '',
		},
	});

	const updateOrg = useUpdateOrg();

	const onSubmit = (values: UpdateOrgSchema) => {
		updateOrg.mutate({
			id: org.id,
			data: {
				...values,
			},
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<InputField
					control={form.control}
					disabled={updateOrg.isPending}
					name="name"
					label={t('common.name')}
					placeholder={t('orgs.name_placeholder')}
				/>
				<TextareaField
					control={form.control}
					disabled={updateOrg.isPending}
					name="description"
					label={t('common.descripton')}
					placeholder={t('orgs.descr_placeholder')}
				/>
				<div className="flex w-full">
					<Button
						type="submit"
						disabled={
							updateOrg.isPending ||
							((!form.formState.touchedFields.name ||
								!form.formState.touchedFields.description) &&
								!form.formState.isValid)
						}
					>
						<SaveIcon />
						{t('actions.save')}
					</Button>
				</div>
			</form>
		</Form>
	);
};

export const OrgEditFormSkeleton = () => {
	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Skeleton className="h-3.5 w-12" />
				<Skeleton className="h-9 w-full" />
			</div>
			<div className="space-y-2">
				<Skeleton className="h-3.5 w-12" />
				<Skeleton className="h-16 w-full" />
			</div>
			<Skeleton className="h-9 w-20" />
		</div>
	);
};
