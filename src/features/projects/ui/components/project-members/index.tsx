import { useMemo, useState } from 'react';

import { UserPlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { ProjectById } from '@/features/projects/types';

import { AddMembersDialog } from '../add-members-dialog';
import { ProjectMember, ProjectMemberSkeleton } from './project-member';

interface ProjectMembersProps {
	project: ProjectById;
}

export const ProjectMembers = ({ project }: ProjectMembersProps) => {
	const t = useTranslations();

	const [open, setOpen] = useState(false);

	const existedMembersIds = useMemo(() => {
		return project.members.map(member => member.userId);
	}, [project.members]);

	const canInvite = project.permissions.canInvite;

	return (
		<>
			<AddMembersDialog
				open={open}
				onOpenChange={setOpen}
				projectId={project.id}
				orgId={project.organizationId}
				existedIds={existedMembersIds}
			/>
			<div className="flex flex-col gap-3 rounded-md border bg-card p-4">
				<div className="flex h-9 items-center justify-between">
					<p className="font-medium">{t('common.members')}</p>
					{canInvite && (
						<Button size="sm" onClick={() => setOpen(true)}>
							<UserPlusIcon />
							{t('actions.add')}
						</Button>
					)}
				</div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
					{project.members.map(member => (
						<ProjectMember
							key={member.userId}
							orgId={project.organizationId}
							member={member}
							canUpdate={
								project.permissions.isOrgAdmin ||
								project.permissions.isProjectAdmin
							}
						/>
					))}
				</div>
			</div>
		</>
	);
};

export const ProjectMembersSkeleton = () => {
	return (
		<div className="flex flex-col gap-3 rounded-md border bg-card p-4">
			<div className="flex h-9 items-center">
				<Skeleton className="h-4" />
			</div>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
				{Array.from({ length: 10 }).map((_, idx) => (
					<ProjectMemberSkeleton key={idx} />
				))}
			</div>
		</div>
	);
};
