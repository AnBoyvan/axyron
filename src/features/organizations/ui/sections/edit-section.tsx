import { useTranslations } from 'next-intl';

import { AccessDenied } from '@/components/shared/access-denied';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { useOrgById } from '../../hooks/use-org-by-id';
import type { UpdateOrgRuleSchema } from '../../schemas/update-org-rule-schema';
import { OrgEditForm, OrgEditFormSkeleton } from '../components/org-edit-form';
import {
	OrgImageSelect,
	OrgImageSelectSkeleton,
} from '../components/org-image-select';
import { OrgRule, OrgRuleSkeleton } from '../components/org-rule';

const rules = ['canInvite', 'canCreateProject', 'canCreateMeeting'];

interface EditSectionProps {
	orgId: string;
}

export const EditSection = ({ orgId }: EditSectionProps) => {
	const t = useTranslations();

	const { data } = useOrgById(orgId);

	if (!data.permissions.isAdmin) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<AccessDenied />
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
			<Card className="col-span-1 lg:col-span-2">
				<CardContent className="flex flex-col gap-4">
					<OrgImageSelect
						orgId={data.id}
						orgImage={data.image}
						orgName={data.name}
					/>
					<OrgEditForm org={data} />
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>{t('common.permissions')}</CardTitle>
					<CardDescription>{t('orgs.rules_description')}</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					{rules.map(rule => (
						<OrgRule
							key={rule}
							orgId={data.id}
							rule={rule as UpdateOrgRuleSchema['rule']}
							value={data[rule as UpdateOrgRuleSchema['rule']]}
						/>
					))}
				</CardContent>
			</Card>
		</div>
	);
};

export const EditSectionSkeleton = () => {
	return (
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
			<Card className="col-span-1 lg:col-span-2">
				<CardContent className="flex flex-col gap-4">
					<OrgImageSelectSkeleton />
					<OrgEditFormSkeleton />
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<Skeleton className="h-4.5 w-44" />
					<Skeleton className="mt-1 h-3.5 w-full" />
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					{rules.map(rule => (
						<OrgRuleSkeleton key={rule} />
					))}
				</CardContent>
			</Card>
		</div>
	);
};
