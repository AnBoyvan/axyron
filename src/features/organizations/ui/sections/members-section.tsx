import { useState } from 'react';

import { UsersIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
	SearchFilter,
	SearchFilterSkeleton,
} from '@/components/shared/search-filter';
import { Skeleton } from '@/components/ui/skeleton';

import { useOrgMembers } from '../../hooks/use-org-members';
import { OrgMember, OrgMemberSkeleton } from '../components/org-member';

interface MembersSectionProps {
	orgId: string;
}

export const MembersSection = ({ orgId }: MembersSectionProps) => {
	const t = useTranslations();

	const [search, setSearch] = useState('');

	const { data } = useOrgMembers(orgId);

	const filtered = data.filter(item =>
		item.name.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<div className="flex flex-col gap-4 lg:gap-8">
			<div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
				<div className="flex items-center gap-2">
					<UsersIcon className="size-5" />
					<p className="font-semibold text-lg">{t('orgs.members')}</p>
				</div>
				<SearchFilter
					value={search}
					onChange={setSearch}
					placeholder={t('common.search_placeholder')}
				/>
			</div>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
				{filtered.map(member => (
					<OrgMember key={member.userId} member={member} />
				))}
			</div>
		</div>
	);
};

export const MembersSectionSkeleton = () => {
	return (
		<div className="flex flex-col gap-4 lg:gap-8">
			<div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
				<Skeleton className="h-5 w-56" />
				<SearchFilterSkeleton />
			</div>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
				{Array.from({ length: 8 }).map((_, idx) => (
					<OrgMemberSkeleton key={idx} />
				))}
			</div>
		</div>
	);
};
