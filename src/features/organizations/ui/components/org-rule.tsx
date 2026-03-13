import { useTranslations } from 'next-intl';

import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';

import { useUpdateOrgRule } from '../../hooks/use-update-org-rule';
import type { UpdateOrgRuleSchema } from '../../schemas/update-org-rule-schema';

interface OrgRuleProps {
	orgId: string;
	rule: UpdateOrgRuleSchema['rule'];
	value: UpdateOrgRuleSchema['value'];
}

export const OrgRule = ({ orgId, rule, value }: OrgRuleProps) => {
	const t = useTranslations();

	const updateRule = useUpdateOrgRule();

	const onChange = () => {
		updateRule.mutate({
			id: orgId,
			data: {
				rule,
				value: !value,
			},
		});
	};

	return (
		<div className="flex items-center space-x-2">
			<Switch
				id={rule}
				checked={value}
				disabled={updateRule.isPending}
				onClick={onChange}
			/>
			<Label>{t(`orgs.rules.${rule}`)}</Label>
		</div>
	);
};

export const OrgRuleSkeleton = () => {
	return (
		<div className="flex items-center space-x-2">
			<Skeleton className="h-4.5 w-8 rounded-full" />
			<Skeleton className="h-4 w-32" />
		</div>
	);
};
