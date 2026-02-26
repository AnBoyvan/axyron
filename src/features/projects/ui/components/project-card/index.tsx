import Link from 'next/link';

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

import type { Project } from '../../../types';
import { ProjectStatus } from '../project-status';
import { ProjectVisibility } from '../project-visibility';
import { ProjectCardMember } from './project-card-members';
import { ProjectCardProgress } from './project-card-progress';

interface ProjectCardProps {
	project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
	return (
		<Link
			prefetch
			href={`/org/${project.organizationId}/projects/${project.id}`}
			className="h-full"
		>
			<Card className="h-full cursor-pointer gap-4 py-4 transition-colors hover:border-primary">
				<CardHeader className="px-4">
					<div className="flex items-center gap-4 overflow-hidden">
						<ProjectVisibility visibility={project.visibility} />
						<CardTitle className="truncate">{project.name}</CardTitle>
						<ProjectStatus
							isArchived={project.archived}
							status={project.status}
							className="ml-auto"
						/>
					</div>
					<CardDescription className="line-clamp-2">
						{project.description}
					</CardDescription>
				</CardHeader>
				<CardContent className="mt-auto px-4">
					<ProjectCardProgress tasks={project.tasks} />
				</CardContent>
				<div className="px-4">
					<Separator />
				</div>
				<CardFooter className="flex-wrap gap-2">
					{project.members.map(member => (
						<ProjectCardMember key={member.userId} member={member} />
					))}
				</CardFooter>
			</Card>
		</Link>
	);
};

export const ProjectCardSkeleton = () => {
	return (
		<Card className="h-[220px] gap-4 py-4">
			<CardHeader className="px-4">
				<div className="flex items-center gap-4 overflow-hidden">
					<Skeleton className="size-4 rounded-full" />
					<Skeleton className="h-4 w-40" />
					<Skeleton className="ml-auto h-5 w-16 rounded-full" />
				</div>
				<CardDescription className="flex flex-col gap-2 py-1">
					<Skeleton className="h-3.5 w-full" />
					<Skeleton className="h-3.5 w-40" />
				</CardDescription>
			</CardHeader>
			<CardContent className="mt-auto flex flex-col gap-2 px-4">
				<div className="flex justify-between">
					<Skeleton className="h-5 w-16" />
					<Skeleton className="h-5 w-8" />
				</div>
				<Skeleton className="h-2 w-full" />
			</CardContent>
			<div className="px-4">
				<Separator />
			</div>
			<CardFooter className="flex-wrap gap-2">
				{Array.from({ length: 5 }).map((_, idx) => (
					<Skeleton key={idx} className="size-8 rounded-full" />
				))}
			</CardFooter>
		</Card>
	);
};
