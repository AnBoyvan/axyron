import { useTranslations } from 'next-intl';

import type { Activity, ActivityMeta } from '../../types';

interface RenamedActionProps {
	activity: Activity;
}

export const RenamedAction = ({ activity }: RenamedActionProps) => {
	const t = useTranslations();

	const meta = activity.meta as ActivityMeta | null;

	return (
		<>
			{t.rich('activities.action.renamed', {
				entityType: t(`activities.type.${activity.entityType}`),
				from: meta?.from ?? '',
				to: meta?.to ?? '',
				b: chunks => <strong>{chunks}</strong>,
			})}
		</>
	);
};
