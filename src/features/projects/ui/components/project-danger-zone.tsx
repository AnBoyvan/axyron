import { ArchiveIcon, Trash2Icon, TriangleAlertIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { useConfirm } from '@/hooks/use-confirm';
import { cn } from '@/lib/utils/cn';

import { useRemoveProject } from '../../hooks/use-remove-project';
import { useUpdateProject } from '../../hooks/use-update-project';

interface ProjectDangerZoneProps {
	projectId: string;
	isArchived?: boolean;
}

export const ProjectDangerZone = ({
	projectId,
	isArchived,
}: ProjectDangerZoneProps) => {
	const t = useTranslations();

	const [ArchiveConfirmDialog, confirmArchive] = useConfirm({
		title: t('common.sure'),
		message: t('projects.archive_confirm'),
		action: t('actions.archive'),
		variant: 'destructive',
	});
	const [RemoveConfirmDialog, confirmRemove] = useConfirm({
		title: t('common.sure'),
		message: t('projects.remove_confirm'),
		action: t('actions.remove'),
		variant: 'destructive',
		media: <TriangleAlertIcon className="size-10 text-destructive" />,
	});

	const updateProject = useUpdateProject();
	const removeProject = useRemoveProject();

	const onArchive = async () => {
		const ok = await confirmArchive();

		if (!ok) return;

		updateProject.mutate({
			id: projectId,
			data: { archived: true },
		});
	};

	const onRemove = async () => {
		const ok = await confirmRemove();

		if (!ok) return;

		removeProject.mutate({
			id: projectId,
		});
	};

	return (
		<>
			<ArchiveConfirmDialog />
			<RemoveConfirmDialog />
			<div className="flex flex-col gap-4 rounded-md border border-destructive bg-destructive/10 p-4">
				<div className="flex gap-2 text-destructive">
					<TriangleAlertIcon />
					<p className="font-medium">{t('common.danger_zone')}</p>
				</div>
				<div
					className={cn(
						'grid grid-cols-1 gap-4 lg:gap-8',
						!isArchived && 'md:grid-cols-2',
					)}
				>
					{!isArchived && (
						<div className="flex flex-col">
							<p className="text-destructive">{t('projects.archive')}</p>
							<p className="mb-2 text-muted-foreground text-sm">
								{t('projects.archive_description')}
							</p>
							<Button
								size="xs"
								variant="destructive"
								onClick={onArchive}
								className="mt-auto ml-auto w-fit"
							>
								<ArchiveIcon />
								{t('actions.archive')}
							</Button>
						</div>
					)}
					<div className="flex flex-col">
						<p className="text-destructive">{t('projects.remove')}</p>
						<p className="mb-2 text-muted-foreground text-sm">
							{t('projects.remove_description')}
						</p>
						<Button
							size="xs"
							variant="destructive"
							onClick={onRemove}
							className="mt-auto ml-auto w-fit"
						>
							<Trash2Icon />
							{t('actions.remove')}
						</Button>
					</div>
				</div>
			</div>
		</>
	);
};
