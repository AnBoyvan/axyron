/** biome-ignore-all lint/complexity/noUselessFragments: fragment is needed */
import { Fragment, useState } from 'react';

import { useTranslations } from 'next-intl';

import {
	SearchFilter,
	SearchFilterSkeleton,
} from '@/components/shared/search-filter';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useProjectsByUser } from '@/features/projects/hooks/use-projects-by-user';
import { ProjectCardSkeleton } from '@/features/projects/ui/components/project-card';

import { UserProjectsByOrg } from '../components/user-projects-by-org';

export const ProjectsSection = () => {
	const t = useTranslations();

	const [search, setSearch] = useState('');

	const { data } = useProjectsByUser();

	return (
		<div className="flex flex-1 flex-col gap-4 lg:gap-8">
			<h1 className="text-xl">{t('users.my_projects')}</h1>
			<div className="flex justify-between">
				<SearchFilter
					value={search}
					onChange={setSearch}
					placeholder={t('projects.search_placeholder')}
				/>
			</div>
			{data.length > 0 ? (
				<>
					{data.map(org => (
						<Fragment key={org.id}>
							<UserProjectsByOrg orgWithProjects={org} search={search} />
							<Separator />
						</Fragment>
					))}
				</>
			) : (
				<div className="flex flex-1 flex-col items-center justify-center text-muted-foreground">
					{t('projects.no_projects')}
				</div>
			)}
		</div>
	);
};

export const ProjectsSectionSkeleton = () => {
	return (
		<div className="flex flex-1 flex-col gap-4 lg:gap-8">
			<div className="flex h-7 items-center">
				<Skeleton className="h-5 w-24" />
			</div>
			<SearchFilterSkeleton />
			<div className="flex flex-col gap-4">
				<div className="flex items-center gap-2">
					<Skeleton className="size-8 rounded-xl" />
					<Skeleton className="h-4 w-40" />
				</div>
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8 2xl:grid-cols-3">
					{Array.from({ length: 3 }).map((_, idx) => (
						<ProjectCardSkeleton key={idx} />
					))}
				</div>
			</div>
		</div>
	);
};
