import Link from 'next/link';

import { Globe2Icon, LockKeyholeIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

import type { Project } from '../../../types';
import { ProjectCardProgress } from './project-card-progress';
import { ProjectCardVisibility } from './project-card-visibility';
import { ProjectStatus } from './project-status';

interface ProjectCardProps {
	project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
	return (
		<Link
			prefetch
			href={`/${project.organizationId}/projects/${project.id}`}
			className="h-full"
		>
			<Card className="h-full cursor-pointer gap-4 py-4 transition-colors hover:border-primary">
				<CardHeader className="px-4">
					<div className="flex items-center gap-4 overflow-hidden">
						<ProjectCardVisibility visibility={project.visibility} />
						<CardTitle className="truncate">
							{project.name} asdads a asds asd asd asd asd as dasd
						</CardTitle>
						<ProjectStatus
							isArchived={project.archived}
							status={project.status}
						/>
					</div>
					<CardDescription className="line-clamp-2">
						{project.description}
					</CardDescription>
				</CardHeader>
				<CardContent className="mt-auto px-4">
					<ProjectCardProgress tasks={project.tasks} />
					<div className="flex"></div>
				</CardContent>
			</Card>
		</Link>
	);
};
