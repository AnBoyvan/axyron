import { useTranslations } from 'next-intl';

import { useEntityName } from '../../hooks/use-entity-name';
import type { Activity } from '../../types';

interface UnassignedActionProps {
	activity: Activity;
}

export const UnassignedAction = ({ activity }: UnassignedActionProps) => {
	const t = useTranslations();
	const entityName = useEntityName(activity);

	return (
		<>
			{t.rich('activities.action.unassigned', {
				entityName,
				b: chunks => <strong>{chunks}</strong>,
			})}
		</>
	);
};
