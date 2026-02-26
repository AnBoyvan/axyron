import { useState } from 'react';

import { ArchiveRestoreIcon, PencilLineIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useConfirm } from '@/hooks/use-confirm';

import { useUpdateProject } from '../../hooks/use-update-project';
import type { ProjectById } from '../../types';
import { EditProjectDialog } from './edit-project-dialog';

interface ProjectInfoProps {
	project: ProjectById;
}

export const ProjectInfo = ({ project }: ProjectInfoProps) => {
	const t = useTranslations();
	const [ConfirmDialog, confirmUnarchive] = useConfirm({
		title: t('projects.restore_title'),
		message: t.rich('projects.restore_message', {
			projectName: project.name,
			b: chunks => <strong>{chunks}</strong>,
		}),
		action: t('actions.restore'),
	});

	const [isEditOpen, setIsEditOpen] = useState(false);

	const updateProject = useUpdateProject();

	const onRestore = async () => {
		const ok = await confirmUnarchive();

		if (!ok) return;

		updateProject.mutate({
			id: project.id,
			data: { archived: false },
		});
	};

	const canEdit =
		project.permissions.isOrgAdmin || project.permissions.isProjectAdmin;

	const showEditButton = canEdit && !project.archived;

	return (
		<>
			<ConfirmDialog />
			<EditProjectDialog
				project={project}
				open={isEditOpen}
				onOpenChange={setIsEditOpen}
			/>
			<div className="flex flex-col gap-4 rounded-md border bg-card p-4">
				<div className="flex gap-4">
					<div className="flex flex-col gap-1">
						<p className="text-muted-foreground text-sm">{t('common.name')}</p>
						<p>{project.name}</p>
					</div>
					<div className="ml-auto flex gap-4">
						{showEditButton ? (
							<Button size="sm" onClick={() => setIsEditOpen(true)}>
								<PencilLineIcon />
								{t('actions.edit')}
							</Button>
						) : (
							<Button size="sm" onClick={onRestore}>
								<ArchiveRestoreIcon />
								{t('actions.restore')}
							</Button>
						)}
					</div>
				</div>
				<div className="flex flex-col gap-1">
					<p className="text-muted-foreground text-sm">
						{t('common.descripton')}
					</p>
					{project.description ? (
						<p>{project.description}</p>
					) : (
						<p className="text-muted-foreground text-sm italic">
							{t('projects.description_empty')}
						</p>
					)}
				</div>
				<div className="flex gap-8">
					<div className="flex flex-col gap-1">
						<p className="text-muted-foreground text-sm">
							{t('projects.visibility')}
						</p>
						<p>{t(`projects.${project.visibility}`)}</p>
					</div>
					<div className="flex flex-col gap-1">
						<p className="text-muted-foreground text-sm">
							{t('common.status')}
						</p>
						{project.archived ? (
							<p>{t('projects.archived')}</p>
						) : (
							<p>{t(`projects.statuses.${project.status}`)}</p>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export const ProjectInfoSkeleton = () => {
	return (
		<div className="flex flex-col gap-4 rounded-md border bg-card p-4">
			<div className="flex h-12 flex-col justify-between py-1">
				<Skeleton className="h-3.5 w-12" />
				<Skeleton className="h-4.5 w-44" />
			</div>
			<div className="flex flex-col gap-2 py-1">
				<Skeleton className="mb-0.5 h-3.5 w-24" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-1/2" />
			</div>
			<div className="flex gap-8">
				<div className="flex h-12 flex-col justify-between py-1">
					<Skeleton className="h-3.5 w-14" />
					<Skeleton className="h-4.5 w-14" />
				</div>
				<div className="flex h-12 flex-col justify-between py-1">
					<Skeleton className="h-3.5 w-12" />
					<Skeleton className="h-4.5 w-12" />
				</div>
			</div>
		</div>
	);
};
