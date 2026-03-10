import { useTranslations } from 'next-intl';

import { useEntityName } from '../../hooks/use-entity-name';
import type { Activity } from '../../types';

interface CreatedActionProps {
	activity: Activity;
}

export const CreatedAction = ({ activity }: CreatedActionProps) => {
	const t = useTranslations();
	const entityName = useEntityName(activity);

	return (
		<>
			{t.rich('activities.action.created', {
				entityType: t(`activities.type.${activity.entityType}`),
				entityName,
				b: chunks => <strong>{chunks}</strong>,
			})}
		</>
	);
};
