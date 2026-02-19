import { useState } from 'react';

import { PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
	SearchFilter,
	SearchFilterSkeleton,
} from '@/components/shared/search-filter';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useOrgById } from '@/features/organizations/hooks/use-org-by-id';

import { NewProjectDialog } from './new-project-dialog';

interface OrgProjectsHeaderProps {
	orgId: string;
	search: string;
	setSearch: (value: string) => void;
}

export const OrgProjectsHeader = ({
	orgId,
	search,
	setSearch,
}: OrgProjectsHeaderProps) => {
	const t = useTranslations();

	const [open, setOpen] = useState(false);

	const { data } = useOrgById(orgId);

	return (
		<>
			<NewProjectDialog open={open} onOpenChange={setOpen} orgId={orgId} />
			<div className="flex justify-between">
				<SearchFilter
					value={search}
					onChange={setSearch}
					placeholder={t('projects.search_placeholder')}
				/>
				{data.permissions.createProject && (
					<Button onClick={() => setOpen(true)}>
						<PlusIcon />
						{t('common.new')}
					</Button>
				)}
			</div>
		</>
	);
};

export const OrgProjectsHeaderSkeleton = () => {
	return (
		<div className="flex justify-between">
			<SearchFilterSkeleton />
			<Skeleton className="h-9 w-20" />
		</div>
	);
};
